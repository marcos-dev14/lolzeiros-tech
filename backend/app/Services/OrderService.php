<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Buyer;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use App\Models\SupplierInstallmentRule;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class OrderService extends BaseService
{
    public function __construct()
    {
        $this->model = new Order();
    }

    public function enableFilters(array $filters): void
    {
        if (!empty($filters)) {
            $criteria = [];

            foreach ($filters as $key => $value) {
                if (str_contains($key, 'by_')) {
                    $relation = str_replace('by_', '', $key);

                    $criteria[] = new QueryCriteria("{$relation}_id", $value);
                    continue;
                }

                if ($key == 'date') {
                    $date = explode('|', $value);
                    $startDate = str_replace('start:', null, $date[0]);
                    $endDate = str_replace('end:', null, $date[1]);

                    $startDate = !empty($startDate) ? Carbon::parse($startDate)->startOfDay() : null;
                    $endDate = !empty($endDate) ? Carbon::parse($endDate)->endOfDay() : null;

                    if ($startDate && $endDate) {
                        $criteria[] = new QueryCriteria('created_at', [$startDate, $endDate], 'whereBetween');
                    } elseif ($startDate) {
                        $criteria[] = new QueryCriteria('created_at', $startDate, '>=');
                    } else {
                        $criteria[] = new QueryCriteria('created_at', $endDate, '<=');
                    }

                    continue;
                }

                if ($key === 'code') {
                    if (str_contains($value, 'codigo:')) {
                        $value = trim(str_replace('codigo:', '', $value));
                        $criteria[] = new QueryCriteria($key, $value, 'like');
                        continue;
                    }

                    if (str_contains($value, 'cliente:')) {
                        $value = trim(str_replace('cliente:', '', $value));
                        $criteria[] = new QueryCriteria('byClientName', $value, 'hasScope');
                        continue;
                    }

                    if (str_contains($value, 'fornecedor:')) {
                        $value = trim(str_replace('fornecedor:', '', $value));
                        $criteria[] = new QueryCriteria('bySupplierName', $value, 'hasScope');
                        continue;
                    }

                    if (str_contains($value, 'cidade:')) {
                        $value = trim(str_replace('cidade:', '', $value));
                        $criteria[] = new QueryCriteria('byAddressCityName', $value, 'hasScope');
                        continue;
                    }
                }

                $criteria[] = new QueryCriteria($key, $value);
            }

            if (count($criteria)) {
                $this->criteria = new QueryCriteriaCollection('and', ...$criteria);
            }
        }
    }

    /**
     * @throws Exception
     */
    public function store(
        Collection $products,
        null|string $subtotal,
        null|string $couponDiscountValue,
        null|string $couponDiscountValueIpi,
        null|string $installmentDiscountValue,
        null|string $installmentDiscountValueIpi,
        null|string $subtotalWithIpi,
        null|string $discountTotal,
        Model|Client $client,
        null|Address $clientAddress,
        null|Coupon $coupon,
        Supplier $supplier,
        Buyer $buyer,
        float $profileDiscountPercentage,
        float $icmsValue,
        null|string $paymentPromotionTermStart = null,
        null|string $comments = null,
        null|SupplierInstallmentRule $installmentRule = null,
        null|ShippingCompany $shippingCompany = null,
    ): Order {
        try {

            $order = $this->model::create([
                'origin' => 'Website',
                'installment_rule' => $installmentRule?->installments,
                'installment_rule_value' => $installmentRule?->discount_value ?? $installmentRule?->additional_value ?? 0.0,
                'fractional_box' => ($products->first()->fractionated_box ?? 0),
                'profile_discount' => $profileDiscountPercentage,
                'payment_promotion_term_start' => $paymentPromotionTermStart,
                'count_products' => $products->count(),
                'count_sum_products' => $products->sum('qty'),
                'current_status' => 'new',
                'lead_time' => $supplier->leadTime?->name,
                'shipping_company_id' => $shippingCompany?->id,
                'shipping_company_name' => $shippingCompany?->name,
                'total_value' => $subtotal,
                'total_value_with_ipi' => $subtotalWithIpi,
                'total_discount' => $discountTotal,
                'coupon_discount_value' => $couponDiscountValue ?? 0,
                'coupon_discount_value_ipi' => $couponDiscountValueIpi ?? 0,
                'installment_discount_value' => $installmentDiscountValue ?? 0,
                'installment_discount_value_ipi' => $installmentDiscountValueIpi ?? 0,
                'coupon_id' => $coupon?->id ?? null,
                'comments' => $comments,
                'client_id' => $client->id,
                'client_last_order' => $client->last_order_date,
                'address_street' => $clientAddress?->street,
                'address_number' => $clientAddress?->number,
                'address_complement' => $clientAddress?->complement,
                'address_district' => $clientAddress?->district,
                'address_city' => $clientAddress?->city?->name,
                'address_city_id' => $clientAddress?->city?->id,
                'address_zipcode' => $clientAddress?->zipcode,
                'address_state_id' => $clientAddress?->state?->id,
                'address_state' => $clientAddress?->state?->code,
                'product_supplier_id' => $supplier->id,
                'product_supplier_name' => $supplier?->name,
                'seller_id' => $client?->seller_id,
                'sale_channel_id' => 8,
                'order_type_id' => 1,
                'buyer_id' => $buyer?->id,
                'buyer_name' => $buyer?->name,
                'buyer_email' => $buyer?->email,
                'buyer_cellphone' => $buyer?->cellphone,
                'icms' => $icmsValue,
            ]);
            foreach ($products as $product) {
                OrderProduct::create([
                    'title' => $product->title,
                    'reference' => $product->reference,
                    'image' => $product->getRawOriginal('image'),
                    'qty' => $product->qty,
                    'ipi' => $product->ipi,
                    'unit_price' => $product->getRawOriginal('unit_price'),
                    'unit_price_with_ipi' => $product->getRawOriginal('unit_price_with_ipi'),
                    'original_price' => $product->getRawOriginal('original_price'),
                    'subtotal' => $product->getRawOriginal('subtotal'),
                    'subtotal_with_ipi' => $product->getRawOriginal('subtotal_with_ipi'),
                    'fractionated' => $product->fractionated,
                    'discount' => $product->getRawOriginal('discount'),
                    'coupon_discount_unit' => optional($product)->getRawOriginal('coupon_discount_unit') ?? 0,
                    'coupon_discount_unit_ipi' => optional($product)->getRawOriginal('coupon_discount_unit_ipi') ?? 0,
                    'coupon_discount_value' => optional($product)->getRawOriginal('coupon_discount_value') ?? 0,
                    'coupon_discount_value_ipi' => optional($product)->getRawOriginal('coupon_discount_value_ipi') ?? 0,
                    'installment_discount_value' => optional($product)->getRawOriginal('installment_discount_value') ?? 0,
                    'installment_discount_value_ipi' => optional($product)->getRawOriginal('installment_discount_value_ipi') ?? 0,
                    'installment_discount_unit' => optional($product)->getRawOriginal('installment_discount_unit') ?? 0,
                    'installment_discount_unit_ipi' => optional($product)->getRawOriginal('installment_discount_unit_ipi') ?? 0,
                    'product_id' => $product->product_id,
                    'order_id' => $order->id,
                ]);
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 500);
        }

        return $order;
    }
}
