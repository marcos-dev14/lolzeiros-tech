<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartInstance;
use App\Models\CartInstanceProduct;
use App\Models\Client;
use App\Models\Product;

use App\Traits\Loggable;

use Carbon\Carbon;
use Exception;
use Throwable;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use JetBrains\PhpStorm\ArrayShape;

class CartService
{
    use Loggable;

    public function __construct(
        private Cart $_cartModel,
        private CartInstance $_cartInstanceModel,
        private CartInstanceProduct $_cartInstanceProductModel,
        private Product $_productModel,
    ) {
    }

    public function getCart(Client $client, $withRelations = false): Cart
    {
        $sessionCart = session('cart.full');

        if ($sessionCart?->client_id === $client->id) {
            return $sessionCart;
        }

        $cart = $this->_cartModel::firstOrCreate(['client_id' => $client->id]);

        if ($withRelations) {
            $cart->load('instances.supplier', 'instances.products');
        }

        return $cart;
    }

    public function getFullCart(Model|Client $client, $instanceWhere = null)
    {
        $cart = $this->_cartModel
            ->where('client_id', $client->id)
            ->select('id', 'client_id')
            ->with('instances', function ($instancesQuery) use ($instanceWhere) {
                return $instancesQuery
                    ->select('id', 'uuid', 'cart_id', 'product_supplier_id', 'supplier_installment_rule_id', 'created_at', 'updated_at')
                    ->withSum('products', 'subtotal')
                    ->withSum('products', 'subtotal_with_ipi')
                    ->withSum('products', 'discount')
                    ->withSum('products', 'qty')
                    ->withSum('products', 'ipi_value')
                    ->withCount('products')
                    ->where($instanceWhere[0] ?? null, $instanceWhere[1] ?? null, $instanceWhere[2] ?? null)
                    ->whereHas('products')
                    ->with([
                        'products' => function ($productsQuery) {
                            return $productsQuery->select(
                                'id',
                                'reference',
                                'title',
                                'image',
                                'qty',
                                'ipi',
                                'ipi_value',
                                'unit_price',
                                'original_price',
                                'unit_price_with_ipi',
                                'subtotal',
                                'subtotal_with_ipi',
                                'discount',
                                'fractionated',
                                'cart_instance_id',
                                'product_id',
                                'availability',
                                'updated_at'
                            )->with('product.supplier')->with('product.coupons')->orderBy('reference');
                        },
                        'supplier' => function ($supplierQuery) {
                            return $supplierQuery
                                ->select('id', 'name', 'company_name', 'image', 'min_order', 'min_ticket', 'lead_time_id', 'shipping_type_id')
                                ->with([
                                    'paymentPromotions' => function ($paymentPromotionsQuery) {
                                        return $paymentPromotionsQuery
                                            ->where('order_deadline', '>', Carbon::now())
                                            ->select('id', 'order_deadline', 'min_value', 'payment_term_start', 'supplier_id');
                                    },
                                    'installmentRules',
                                    'leadTime',
                                    'shippingType'
                                ]);
                        },
                        'installmentRule'
                    ]);
            })
            ->first();
        return $cart ?? $this->getCart($client);
    }

    public function getCartInstanceFromProduct(Cart $cart, Model|Product $product)
    {
        return $this->_cartInstanceModel::firstOrCreate([
            'cart_id' => $cart->id,
            'product_supplier_id' => $product->supplier_id
        ]);
    }

    /**
     * @throws Throwable
     */
    public function addOrUpdateToCart(Client $client, int|Product|Builder $product, int $qty = 1, $clearQuantity = false)
    {
        if (is_int($product)) {
            $product = $this->_productModel::with('images')->find($product);
        }

        throw_if(
            !$product || ($product instanceof Product && $product->canBeSold() !== true),
            new Exception('Este produto não está mais disponível'),
            400
        );

        $cart = self::getCart($client);
        $cartInstance = self::getCartInstanceFromProduct($cart, $product);

        $cartProduct = $cartInstance->products()->where('product_id', $product->id)->first();

        if ($cartProduct) {
            $currentQty = $clearQuantity ? 0 : $cartProduct->qty;
            $cartProduct->update($this->getInstanceProductData($product, ($currentQty + $qty)));
        } else {
            $this->_cartInstanceProductModel::create(
                array_merge([
                    'product_id' => $product->id,
                    'cart_instance_id' => $cartInstance->id
                ], $this->getInstanceProductData($product, $qty))
            );
        }

        return $cartInstance;
    }

    public function addOrUpdateToCartToJob(Client $client, int|Product|Builder $product, int $qty = 1, $clearQuantity = false, $logKey = null): void
    {
        if (is_int($product)) {
            $product = $this->_productModel::with('images')->find($product);
        }

        if (!$product || ($product instanceof Product && $product->canBeSold() !== true)) {
            $this->addLogMessage($logKey, "Produto '" . $product?->ean13 . "' não está mais disponível.");
            return;
        }

        $cart = self::getCart($client);
        $cartInstance = self::getCartInstanceFromProduct($cart, $product);

        $cartProduct = $cartInstance->products()->where('product_id', $product->id)->first();

        if ($cartProduct) {
            $currentQty = $clearQuantity ? 0 : $cartProduct->qty;
            $cartProduct->update($this->getInstanceProductData($product, ($currentQty + $qty)));
        } else {
            $this->_cartInstanceProductModel::create(
                array_merge([
                    'product_id' => $product->id,
                    'cart_instance_id' => $cartInstance->id
                ], $this->getInstanceProductData($product, $qty))
            );
        }
    }

    public function removeToCart(Client $client, int $productId, CartInstance|Model $instance): void
    {
        $instance->load('products');

        $instanceProduct = $instance->products->where('product_id', $productId)->first();

        abort_if(!$instanceProduct, 404);

        $instanceProduct->delete();

        $this->setSessionCart($client);
    }

    public function removeToCartAll(Client $client, CartInstance|Model $instance): void
    {
        $instance->load('products');

        $instanceProduct = $instance->products;

        abort_if(!$instanceProduct, 404);
        foreach ($instanceProduct as $product) {
            $product->delete();
        }

        $this->setSessionCart($client);
    }

    #[ArrayShape([
        'title' => "string",
        'reference' => "string",
        'image' => "string",
        'qty' => "int",
        'ipi' => "string",
        'ipi_value' => "string",
        'unit_price' => "string",
        'original_price' => "string",
        'unit_price_with_ipi' => "string",
        'subtotal' => "float",
        'subtotal_with_ipi' => "float",
        'discount' => "float",
        'discount_percentage' => "float",
        'fractionated' => "boolean",
    ])]
    protected function getInstanceProductData(Product|Model $product, int $qty = 1): array
    {
        $productPrices = $product->getPriceWithPromotionDiscounts($qty);

        return [
            'title' => $product->title,
            'reference' => $product->reference,
            'image' => $product->images->first()->name ?? null,
            'qty' => $qty,
            'ipi' => $productPrices['ipi'],
            'ipi_value' => $productPrices['ipi'] > 0 ? ($productPrices['ipi'] * $productPrices['subtotal'] / 100) : 0.0,
            'unit_price' => $productPrices['unit_price'],
            'original_price' => $productPrices['original_price'],
            'unit_price_with_ipi' => $productPrices['unit_price_with_ipi'],
            'subtotal' => $productPrices['subtotal'],
            'subtotal_with_ipi' => $productPrices['subtotal_with_ipi'],
            'discount' => $productPrices['price_difference'],
            'discount_percentage' => $productPrices['discount_percentage'],
            'fractionated' => $product->canBeFractionated(),
            'availability' => $product->availability,
            'hasCoupon' => $product->coupons()
        ];
    }

    public function setSessionCart(Client $client): void
    {
        //session(['cart.full' => $this->getFullCart($client)]);
        //$this->setSessionProductsInCart();


        //versao nova - para atualizar o carrinho sempre
        $cart = $this->getFullCart($client);

        // Atualizar os preços dos produtos antes de definir na sessão
        foreach ($cart->instances as $instance) {
            foreach ($instance->products as $product) {
                // Recalcular o preço com as promoções ou atualizações de preços
                $updatedProductData = $this->getInstanceProductData($product->product, $product->qty);
                $product->update($updatedProductData);
            }
        }

        session(['cart.full' => $cart]);
        $this->setSessionProductsInCart();

    }

    public function setSessionSupplier(?int $supplierId): void
    {
        if ($supplierId) {
            session(['filters.suppliers.selected' => $supplierId]);
        }
    }

    public function setSessionProductsInCart(): void
    {
        if (session()->has('cart.full')) {
            $cart = session('cart.full');

            $instances = $cart?->instances;
            $products = collect();

            foreach ($instances as $instance) {
                foreach ($instance->products as $product) {
                    $products->push([
                        'product_id' => $product->product_id,
                        'qty' => $product->qty,
                        'unit_price' => $product->unit_price,
                        'total_price' => $product->subtotal,
                        'instance' => $instance->uuid,
                        'availability' => $product->availability,
                        'box_price' => $product->box_price,
                        'box_price_promotional' => $product->box_price_promotional,
                        'box_minimal' => $product->box_minimal,
                        'box_subtotal' => $product->box_subtotal,
                    ]);
                }
            }

            session()->put('cart.products', $products);
        }
    }
}
