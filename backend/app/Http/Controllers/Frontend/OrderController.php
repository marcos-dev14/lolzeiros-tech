<?php

namespace App\Http\Controllers\Frontend;

use App\Exports\OrderFrontExport;
use App\Http\Requests\Frontend\OrderRequest;
use App\Models\Address;
use App\Models\CartInstance;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use App\Models\SupplierInstallmentRule;
use App\Services\CartService;
use App\Services\ClientSessionManager;
use App\Services\OrderService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Facades\Excel;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use JetBrains\PhpStorm\NoReturn;

class OrderController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private ClientSessionManager $_sessionManager,
        private CartService $_cartService,
        private OrderService $_orderService,
    ) {
        parent::__construct();

        $this->setPageSeo();
    }

    public function store(OrderRequest $request): RedirectResponse|View
    {
        try {
            DB::beginTransaction();
    
            $client = $this->_sessionManager->getSessionSelectedClient();
            $client = Client::with('group', 'buyer', 'seller')->find($client['id']);
    
            $cart = $this->_cartService->getFullCart($client, ['uuid', '=', $request->instance]);
            $instance = $cart->instances->first();
    
            if ($cart->client_id !== $client->id || $instance->cart_id !== $cart->id) {
                abort(401);
            }
    
            $installmentRule = SupplierInstallmentRule::find($request->installment_rule_id);
            $supplier = $instance->supplier; 
            $shippingCompany = $this->getShippingCompanyFromRequest($request);
    
            $icmsValue = $this->getIcmsValue($client?->main_address, $supplier);
    
            $profileDiscountPercentage = $this->getProfileDiscountPercentage(
                $supplier, 
                $client->client_profile_id
            );
            $paymentPromotionTermStart = $this->getPaymentPromotion(
                $supplier, 
                $instance->products_sum_subtotal_with_ipi
            );
    
            $subtotalWithDiscount = $instance->products_sum_subtotal;
            $subtotalIpiWithDiscount = $instance->products_sum_subtotal_with_ipi;
            $couponDiscountValue = 0;
            $couponDiscountValueIpi = 0;
            
            if ($request->couponHidden !== null) {
                $coupon = Coupon::whereNull('used')->where('name', $request->couponHidden)->first();
    
                if (!$coupon) {
                    return redirect()->back()->with('error', 'Oops! Cupom inválido ou usado.')->withInput();
                }
    
                $this->getDiscountedSubtotal($coupon, $instance, $installmentRule);
                $this->getDiscountedSubtotal($coupon, $instance, $installmentRule, withIpi: true);
    
                $discountPercentage = $coupon->discount_porc / 100;
                $couponDiscountValue = $subtotalWithDiscount * $discountPercentage;
                $couponDiscountValueIpi = $subtotalIpiWithDiscount * $discountPercentage;
    
                $coupon->update();
                $couponStatus = new CouponStatus();
                $couponStatus->client_id = $client->id;
                $couponStatus->coupon_id = $coupon->id;
                $couponStatus->name = 'usado';
                $couponStatus->save();
            }
    
            $productsSubtotal = $instance->products_sum_subtotal;
            $productsSubtotalWithIpi = $instance->products_sum_subtotal_with_ipi;
            $installmentRulePercentage = $installmentRule?->discount_value ?? $installmentRule?->additional_value ?? 0.0;
            
            if ($installmentRule?->discount_value) {
                $installmentRuleValue = $productsSubtotal * ($installmentRulePercentage / 100);
                $installmentRuleValueIpi = $productsSubtotalWithIpi * ($installmentRulePercentage / 100);
            } elseif ($installmentRule?->additional_value) {
                $installmentRuleValue = -$productsSubtotal * ($installmentRulePercentage / 100);
                $installmentRuleValueIpi = -$productsSubtotalWithIpi * ($installmentRulePercentage / 100);
            }
    
           $order = $this->_orderService->store(
                products: $instance->products,
                coupon: $coupon ?? null,
                subtotal: $instance->products_sum_subtotal,
                subtotalWithIpi: $instance->products_sum_subtotal_with_ipi,
                couponDiscountValue: $couponDiscountValue,
                couponDiscountValueIpi: $couponDiscountValueIpi,
                installmentDiscountValue: $installmentRuleValue,
                installmentDiscountValueIpi: $installmentRuleValueIpi,
                discountTotal: $instance->products_sum_discount,
                client: $client,
                clientAddress: $client?->main_address,
                supplier: $supplier, // Garante que o supplier seja passado
                buyer: $client->buyer,
                profileDiscountPercentage: $profileDiscountPercentage,
                icmsValue: $icmsValue,
                paymentPromotionTermStart: $paymentPromotionTermStart,
                comments: $request?->comments,
                installmentRule: $installmentRule,
                shippingCompany: $shippingCompany
            );
    
        } catch (Exception $exception) {
            DB::rollBack();
            return redirect()->back()->with('error', $exception->getMessage())->withInput();
        }
    
        DB::commit();
        $instance->delete();
    
        $redirectRoute = (!empty($client->cart?->instances) && count($client->cart?->instances) > 1) ? 'cart.index' : 'buyer.congratulations';
    
        return view('pages.buyer.congratulations', compact('client', 'order'));
    }
    

    protected function getShippingCompanyFromRequest(Request $request): ?ShippingCompany
    {
        return ($request->shipping_company_id !== 'new')
            ? ShippingCompany::find($request->shipping_company_id)
            : ShippingCompany::create([
                'name' => $request->shipping_company['name'],
                'document' => $request->shipping_company['document'],
                'phone' => $request->shipping_company['phone'],
            ]);
    }

    protected function getProfileDiscountPercentage(Supplier $supplier, null|int $clientProfileId = null): float
    {
        if (is_null($clientProfileId)) {
            return 0.0;
        }

        $supplierProfileDiscounts = $supplier->profileDoesntHaveCategoryDiscounts
            ->where('client_profile_id', $clientProfileId)
            ->first();

        return $supplierProfileDiscounts->discount_value ?? 0.0;
    }

    protected function getPaymentPromotion(Supplier $supplier, $subtotal): ?string
    {
        $paymentPromotion = $supplier->paymentPromotions()
            ->where('min_value', '>=', $subtotal)
            ->where('order_deadline', '>=', now()->format('Y-m-d'))
            ->orderBy('min_value', 'desc')
            ->first();

        return $paymentPromotion->order_deadline ?? null;
    }

    protected function getIcmsValue(Address $clientMainAddress, Supplier $supplier): float
    {
        if (!count($supplier->stateDiscounts)) {
            return 0.0;
        }

        $stateDiscountPercentage = 0;
        $stateAdditionalPercentage = 0;
        $clientMainAddressStateCode = $clientMainAddress->state?->code;

        foreach ($supplier->stateDiscounts as $discount) {
            $discountStates = $discount->states;

            if ($discountStates->contains('code', $clientMainAddressStateCode)) {
                $stateDiscountPercentage += floatval($discount->discount_value);
                $stateAdditionalPercentage += floatval($discount->additional_value);
            }
        }

        if ($stateDiscountPercentage) {
            return $stateDiscountPercentage * -1;
        }

        if ($stateAdditionalPercentage) {
            return $stateAdditionalPercentage * -1;
        }

        return 0.0;
    }

    public function cancel($instanceUuid): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $client = $this->_sessionManager->getSessionSelectedClient();
            $client = Client::with('group', 'profile')->find($client['id']);
            $cart = $this->_cartService->getFullCart($client, ['uuid', '=', $instanceUuid]);
            $instance = $cart->instances->first();
            $icmsValue = $this->getIcmsValue($client?->main_address, $instance->supplier);
            $profileDiscountPercentage = $this->getProfileDiscountPercentage(
                $instance->supplier,
                $client->client_profile_id
            );
            $paymentPromotionTermStart = $this->getPaymentPromotion(
                $instance->supplier,
                $instance->products_sum_subtotal_with_ipi
            );

            if ($cart->client_id !== $client->id || $instance->cart_id !== $cart->id) {
                abort(401);
            }

            $order = $this->_orderService->store(
                products: $instance->products,
                subtotal: $instance->products_sum_subtotal,
                subtotalWithIpi: $instance->products_sum_subtotal_with_ipi,
                discountTotal: $instance->products_sum_discount,
                couponDiscountValue: null,
                couponDiscountValueIpi: null,
                installmentDiscountValue: null,
                installmentDiscountValueIpi: null,
                coupon: null,
                client: $client,
                clientAddress: $client?->main_address,
                supplier: $instance?->supplier,
                buyer: $client->buyer,
                profileDiscountPercentage: $profileDiscountPercentage,
                icmsValue: $icmsValue,
                paymentPromotionTermStart: $paymentPromotionTermStart
            );
        } catch (Exception $exception) {
            DB::rollBack();

            return redirect()->back()->with('error', $exception->getMessage())->withInput();
        }

        DB::commit();

        OrderStatus::create([
            'name' => 'canceled',
            'order_id' => $order->id
        ]);

        $instance->delete();

        return redirect()->route('buyer.canceledOrders');
    }

    public function downloadPdf(Request $request, $instanceUuid): View|Factory|Response|Application
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        $client->load('buyer');
        $cart = $this->_cartService->getFullCart($client, ['uuid', '=', $instanceUuid]);
        $instance = $cart?->instances?->first();

        if (!$instance) {
            abort(404);
        }

        if ($client->id !== $cart->client_id) {
            abort(403);
        }

        $supplier = Supplier::select('id', 'name', 'document')->with('contacts', 'leadTime')->find($instance->supplier?->id);
        $shippingCompany = null;
        $products = $instance->products;
        $seller = $client->seller;
        $contact = !empty($client->contacts) ? $client->contacts?->first() : $client->contacts()->first();

        $data = compact(
            'instance',
            'client',
            'supplier',
            'shippingCompany',
            'products',
            'seller',
            'contact'
        );

        if ($request->view == 1) {
            return view('pdf.invoice-cart', $data);
        }

        $fileName = "AugeAPP_{$supplier->name}_{$client->company_name}_" . now()->format('dmY') . ".pdf";

        return Pdf::loadView('pdf.invoice-cart', $data)->stream($fileName);
    }

    public function orderExport($code)
    {

        $order = Order::with('products','coupon')->where('code', $code)->first();

        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        }

        return Excel::download(new OrderFrontExport($order), 'pedido_' . $code . '.xlsx');
    }

    protected function applyCouponDiscountToProducts(Coupon $coupon, Collection $products, bool $withIpi = false, $installmentRule): Collection
    {
        $productId = $coupon->product_id;
        $brandId = $coupon->brand_id;
        $categoryId = $coupon->category_id;
        $discountValue = 0;

        $foundedProducts = !empty($productId) ? $products->where('product_id', $productId) : $products;
        $foundedProducts = !empty($brandId) ? $products->where('product.brand_id', $brandId) : $foundedProducts;
        $foundedProducts = !empty($categoryId) ? $products->where('product.category_id', $categoryId) : $foundedProducts;
        if (empty($productId) && empty($brandId) && empty($categoryId)) {
            $foundedProducts = $products;
        }

        if (!$foundedProducts->count()) {
            return $products;
        }
        foreach ($foundedProducts as $foundedProduct) {
            $unit_price = stringToFloat($foundedProduct->unit_price);
            $unit_price_with_ipi = stringToFloat($foundedProduct->unit_price_with_ipi);
            $subtotal = stringToFloat($foundedProduct->subtotal);
            $subtotal_with_ipi = stringToFloat($foundedProduct->subtotal_with_ipi);
            $discountPercentage = $coupon->discount_porc / 100;
            $discountValue = $discountPercentage * $subtotal;
            $discountUnit = $discountPercentage * $unit_price;
            $discountUnitIpi = $discountPercentage * $unit_price_with_ipi;
            $discountValueIpi = $discountPercentage * $subtotal_with_ipi;

            $installmentRulePercentage = $installmentRule?->discount_value ?? $installmentRule?->additional_value ?? 0.0;
            if ($installmentRule?->discount_value) {
                $installmentRuleValue = $unit_price * ($installmentRulePercentage / 100);
                $installmentRuleValueIpi = $unit_price_with_ipi * ($installmentRulePercentage / 100);
                $installmentRuleSubtotal = $subtotal * ($installmentRulePercentage / 100);
                $installmentRuleSubtotalIpi = $subtotal_with_ipi * ($installmentRulePercentage / 100);
            } elseif ($installmentRule?->additional_value) {
                $installmentRuleValue = -$unit_price * ($installmentRulePercentage / 100);
                $installmentRuleValueIpi = -$unit_price_with_ipi * ($installmentRulePercentage / 100);
                $installmentRuleSubtotal = -$subtotal * ($installmentRulePercentage / 100);
                $installmentRuleSubtotalIpi = -$subtotal_with_ipi * ($installmentRulePercentage / 100);
            }

            $productBase = Product::where('id', $foundedProduct->product_id)->first();
            if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
            } else {
                if ($foundedProduct->coupon_discount_value !== $discountValue || $foundedProduct->coupon_discount_unit !== $discountUnit || $foundedProduct->coupon_discount_unit_ipi !== $discountUnitIpi) {
                    if ($withIpi == true) {
                        $foundedProduct->update([
                            'coupon_discount_value' => $discountPercentage * $subtotal,
                            'coupon_discount_value_ipi' => $discountPercentage * $subtotal_with_ipi,
                            'coupon_discount_unit' => $discountPercentage * $unit_price,
                            'coupon_discount_unit_ipi' => $discountPercentage * $unit_price_with_ipi,
                            'installment_discount_value' => $installmentRuleSubtotal ?? 0,
                            'installment_discount_value_ipi' => $installmentRuleSubtotalIpi ?? 0,
                            'installment_discount_unit' => $installmentRuleValue ?? 0,
                            'installment_discount_unit_ipi' => $installmentRuleValueIpi ?? 0
                        ]);
                    } else {
                        $foundedProduct->update([
                            'coupon_discount_value' => $discountPercentage * $subtotal,
                            'coupon_discount_value_ipi' => $discountPercentage * $subtotal_with_ipi,
                            'coupon_discount_unit' => $discountPercentage * $unit_price,
                            'coupon_discount_unit_ipi' => $discountPercentage * $unit_price_with_ipi,
                            'installment_discount_value' => $installmentRuleSubtotal ?? 0,
                            'installment_discount_value_ipi' => $installmentRuleSubtotalIpi ?? 0,
                            'installment_discount_unit' => $installmentRuleValue ?? 0,
                            'installment_discount_unit_ipi' => $installmentRuleValueIpi ?? 0
                        ]);
                    }
                }
            }
        }

        return $products;
    }

    protected function getDiscountedSubtotal(Coupon $coupon, CartInstance $instance, $installmentRule, bool $withIpi = false): float
    {
        $subtotalField = $withIpi ? 'products_sum_subtotal_with_ipi' : 'products_sum_subtotal';
        $subtotal = $instance->$subtotalField;

        if (!empty($coupon->discount_value)) {
            return $subtotal - $coupon->discount_value;
        }

        if (!empty($coupon->discount_porc)) {
            if (!empty($coupon->product_id) || !empty($coupon->brand_id) || !empty($coupon->category_id)) {
                $products = $this->applyCouponDiscountToProducts($coupon, $instance->products, $withIpi, $installmentRule);

                $productsSubtotalField = str_replace('products_sum_', '', $subtotalField);
                $productsDiscount = $products->sum('coupon_discount_value');
                $productsSubtotal = $products->sum(function ($product) use ($productsSubtotalField) {
                    return stringToFloat($product->$productsSubtotalField);
                });

                return $productsSubtotal - $productsDiscount;
            } elseif (empty($coupon->product_id) && empty($coupon->brand_id) && empty($coupon->category_id)) {
                $products = $this->applyCouponDiscountToProducts($coupon, $instance->products, $withIpi, $installmentRule);

                $productsSubtotalField = str_replace('products_sum_', '', $subtotalField);
                $productsDiscount = $products->sum('coupon_discount_value');
                $productsSubtotal = $products->sum(function ($product) use ($productsSubtotalField) {
                    return stringToFloat($product->$productsSubtotalField);
                });
                return $productsSubtotal - $productsDiscount;
            }

            if (empty($coupon->product_id)) {
                $discount = ($coupon->discount_porc / 100) * $subtotal;
                return $subtotal - $discount;
            }
        }

        return $subtotal;
    }

    public function congratulations()
    {
        try {

            $client = $this->_sessionManager->getSessionSelectedClient();
            $client = Client::with('seller')->find($client['id']);
    

            if (!$client) {
                return redirect()->back()->with('error', 'Cliente não encontrado');
            }
    

            return view('pages.buyer.congratulations', compact('client'));
    
        } catch (Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }
    }    
    
}
