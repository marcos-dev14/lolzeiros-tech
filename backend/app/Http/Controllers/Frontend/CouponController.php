<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\Product;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\ClientSessionManager;
use App\Models\Supplier;
use App\Models\Client;

class CouponController extends BaseController
{
    private ClientSessionManager $_sessionManager;
    private CartService $_cartService;
    private OrderService $_orderService;

    protected array $availableSorts = [
        'random' => 'Ordem Aleatória',
        'slug-asc' => 'Nome A-Z',
        'slug-desc' => 'Nome Z-A',
        'reference-asc' => 'Referência A-Z',
        'reference-desc' => 'Referência Z-A',
        'catalog_page-asc' => 'Catálogo A-Z',
        'catalog_page-desc' => 'Catálogo Z-A',
        'release-desc' => 'Lançamentos',
    ];

    public function __construct(
        ClientSessionManager $_sessionManager,
        CartService $_cartService,
        OrderService $_orderService
    ) {
        parent::__construct();
        $this->_sessionManager = $_sessionManager;
        $this->_cartService = $_cartService;
        $this->_orderService = $_orderService;
    }

    public function index(Request $request)
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        $client = Client::with('group', 'buyer')->find($client['id']);

        $cart = $this->_cartService->getFullCart($client, ['uuid', '=', $request->instance]);
        $instance = $cart->instances->first();
        $products = $instance->products;
        $productCoupon = false;
        $categoryCoupon = false;
        $brandCoupon = false;

        if ($request->coupon !== null) {
            $coupon = Coupon::where(function ($query) use ($client, $request) {
                $query->where('name', $request->coupon)
                    ->where(function ($query) use ($client) {
                        $query->where('buyer_id', $client->buyer->id)
                            ->orWhere('client_id', $client->id)
                            ->orWhere('client_profile_id', $client->client_profile_id)
                            ->orWhere('client_group_id', $client->client_group_id)
                            ->orWhere(function ($query) {
                                $query->whereNull('buyer_id')
                                    ->whereNull('client_id')
                                    ->whereNull('client_group_id')
                                    ->whereNull('client_profile_id');
                            });
                    });
            })->first();

            if ($coupon) {
                $used = CouponStatus::where('coupon_id', $coupon->id)
                    ->where('client_id', $client->id)
                    ->exists();

                if (!$used) {
                    foreach ($products as $product) {
                        $category = Product::find($product->product_id);
                        if ($coupon->product_id && $category->id == $coupon->product_id) {
                            $productCoupon = true;
                        }
                        if ($coupon->brand_id && $category->brand_id == $coupon->brand_id) {
                            $brandCoupon = true;
                        }
                        if ($coupon->category_id && $category->category_id == $coupon->category_id) {
                            $categoryCoupon = true;
                        }
                    }

                    if ($coupon->price && $coupon->price_type == 1 && $instance->products_sum_subtotal < $coupon->price) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Valor do pedido tem que ser maior que ' . $coupon->price . ' !.',
                        ], 400);
                    }

                    if ($coupon->price && $coupon->price_type == 2 && $instance->products_sum_subtotal > $coupon->price) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Valor do pedido tem que ser menor que ' . $coupon->price . ' !.',
                        ], 400);
                    }

                    if ($coupon->brand_id && !$brandCoupon) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Marca não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->category_id && !$categoryCoupon) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Categoria não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->product_id && !$productCoupon) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Produto não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->buyer_id && $coupon->buyer_id != $client->buyer->id) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Você não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->client_id && $coupon->client_id != $client->id) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Cliente não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->supplier_id && $coupon->supplier_id != $instance->supplier->id) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Fornecedor não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->seller_id && $coupon->seller_id != $client->seller_id) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Vendedor não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }
                    if ($coupon->shipping_company_id && $request->shippingCompanyId && $coupon->shipping_company_id != $request->shippingCompanyId) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Frete não se encaixa nos requisitos deste cupom!.',
                        ], 400);
                    }

                    return $this->couponDiscount($coupon, $instance, $productCoupon, $client);

                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Você já usou este Cupom.',
                    ], 400);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Cupom inválido.',
                ], 400);
            }
        }


        return response()->json([
            'success' => false,
            'message' => 'Nenhum cupom fornecido.',
        ], 400);
    }

    public function getProducts(Coupon $coupon, Request $request)
    {
        $supplierId = (int) $request->rp;
        $categoryIds = json_decode($request->ca ?? '[]');
        $brandIds = json_decode($request->ma ?? '[]');
        $attributeIds = json_decode($request->attr ?? '[]');
        $searchTerms = $request->pe ?? null;
        $selectedSort = $request->or ?? 'random';

        $this->baseCacheKey = "$request->rp-$request->ca-$request->ma-$request->attr";

        $supplier = Supplier::find($supplierId);
        $productsBuilder = $this->getProductsBuilder(
            coupon: $coupon,
            supplier: $supplier,
            searchTerms: $searchTerms,
            sortBy: $selectedSort,
            categories: $categoryIds,
            brands: $brandIds,
            attributes: $attributeIds,
            unpublished: (bool) $request?->nao_publicado == '1'
        );

        if ($request->ajax()) {
            $products = $productsBuilder->take(8)->get();
            $renderedProducts = '';

            foreach ($products as $product) {
                $renderedProducts .= view('components._card', ['product' => $product])->render();
            }

            return response()->json($renderedProducts);
        }

        $categories = $supplier ? $this->getSupplierCategoriesByBrands($supplier, $brandIds, $categoryIds) : null;
        $brands = ($supplier || $brandIds) ? $this->getSupplierBrands($supplier, $categoryIds, $brandIds) : null;
        $attributes = ($supplier && $categoryIds) ? $this->getAttributes($productsBuilder, $attributeIds) : null;
        $availableSorts = collect($this->availableSorts);
        $suppliers = $this->getSuppliers($supplierId);

        session(['filters.suppliers.selected' => $supplier?->id]);
        session(['filters.searchTerms' => $searchTerms]);
        session(['filters.selectedSort' => $selectedSort]);
        session(['filter.supplier' => $supplierId]);
        session(['filter.categories' => $categoryIds]);
        session(['filter.brands' => $brandIds]);

        if ($coupon->product_id) {
            $products = $productsBuilder->where('id', $coupon->product_id)->paginate(16)->onEachSide(1)->withQueryString();
        } elseif ($coupon->brand_id) {
            $products = $productsBuilder->where('brand_id', $coupon->brand_id)->paginate(16)->onEachSide(1)->withQueryString();

        } elseif ($coupon->category_id) {
            $products = $productsBuilder->where('category_id', $coupon->category_id)->paginate(16)->onEachSide(1)->withQueryString();

        } elseif ($coupon->supplier_id) {
            $products = $productsBuilder->where('supplier_id', $coupon->supplier_id)->paginate(16)->onEachSide(1)->withQueryString();
        } else {
            $products = $productsBuilder->paginate(16)->onEachSide(1)->withQueryString();
        }

        return view(
            'pages.products',
            compact(
                'supplier',
                'brands',
                'attributes',
                'categories',
                'suppliers',
                'products',
                'availableSorts',
            )
        );
    }

    protected function getProductsBuilder(
        Coupon|null $coupon,
        Supplier|null $supplier,
        string|null $searchTerms,
        string|null $sortBy,
        array $categories = [],
        ?array $brands = [],
        ?array $attributes = [],
        bool $unpublished = true
    ) {
        $products = Product::query()->with('supplier', 'brand', 'pAttributes', 'badge', 'route', 'images', 'coupons')->orderBy('availability');
        if ($unpublished) {
            $products->whereNot(function ($query) {
                $query->published();
            });
        } else {
            $products->published();
        }

        $products->select(
            'id',
            'slug',
            'title',
            'inner_code',
            'reference',
            'supplier_id',
            'unit_price',
            'unit_price_promotional',
            'unit_minimal',
            'box_price',
            'box_price_promotional',
            'box_minimal',
            'dun14',
            'ean13',
            'icms',
            'ipi',
            'release_year',
            'ncm',
            'catalog_name',
            'catalog_page',
            'origin',
            'box_packing_type',
            'category_id',
            'brand_id',
            'packaging',
            'badge_id',
            'availability',
            'expected_arrival'
        );

        if (!empty($searchTerms)) {
            if (str_contains($searchTerms, '"')) {
                $searchTerms = str_replace('"', '', $searchTerms);
                $products->where(function ($query) use ($searchTerms) {
                    $query->where('title', $searchTerms)
                        ->orWhere('searcheable', $searchTerms)
                        ->orWhere('reference', $searchTerms)
                        ->orWhere('ean13', $searchTerms)
                        ->orWhere('dun14', $searchTerms);
                });
            } else {
                $searchTerms = collect(explode(' ', $searchTerms));
                $searchTerms = $searchTerms->filter(fn($term) => (strlen($term) > 2));

                $products->where(function ($query) use ($searchTerms) {
                    foreach ($searchTerms as $term) {
                        $query->orWhere('title', 'like', "%$term%")
                            //->orWhere('slug', 'like', "%$term%")
                            ->orWhere('searcheable', 'like', "%$term%")
                            ->orWhere('reference', 'like', "%$term%")
                            ->orWhere('ean13', 'like', "%$term%")
                            ->orWhere('dun14', 'like', "%$term%");
                    }
                });
            }
        }

        if ($supplier) {
            $products->where('supplier_id', $supplier->id);
        }

        if (is_array($brands) && count($brands)) {
            $products->whereIn('brand_id', $brands);
        }

        if (count($categories)) {
            $products->whereIn('category_id', $categories);
        }

        if (is_array($attributes) && count($attributes)) {
            foreach ($attributes as $attribute) {
                $products->whereHas('pAttributes', function ($query) use ($attribute) {
                    $attribute = explode('|', $attribute);
                    $attributeId = array_shift($attribute);
                    $attributeValue = array_shift($attribute);

                    $query->where('attribute_id', $attributeId)->where('value', $attributeValue);
                });
            }
        }

        if (!empty($sortBy) && str_contains($sortBy, '-')) {
            [$sortByField, $sortByOrder] = explode('-', $sortBy);

            //$products->orderBy('supplier_id');

            if ($sortByField === 'reference') {
                $products->orderByRaw("CAST($sortByField as SIGNED INTEGER) $sortByOrder");
            } elseif ($sortByField === 'release') {
                $products->orderByDesc('release_year');
            } else {
                $products->orderBy($sortByField, $sortByOrder);
            }
        } else {
            $products->inRandomOrder();
        }

        return $products;
    }

    private function couponDiscount(Coupon $coupon, $instance, $productCoupon, $client)
    {
        $date = Carbon::now();
        $createdAt = Carbon::parse($client->created_at);
        $productsWithDiscount = [];

        if ($client->orders->count() > 0) {
            $orderLast = Carbon::parse($client->orders->last()->created_at);

            if ($coupon->type == 2 && $orderLast->greaterThanOrEqualTo($date->subDays($coupon->period))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esse cupom é apenas para cliente que não compram a um mês!.',
                ], 400);
            }
        }

        if ($coupon->type == 2 && $client->orders->count() <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Esse cupom é apenas para cliente que não compram a um mês!.',
            ], 400);
        }

        if ($coupon->type == 1 && $createdAt->lessThan($date->subDays($coupon->period))) {
            return response()->json([
                'success' => false,
                'message' => 'Esse cupom é apenas para cliente com menos de um mês de criação!.',
            ], 400);
        }

        if (!Carbon::parse($coupon->validate)->greaterThan($date)) {
            return response()->json([
                'success' => false,
                'message' => 'Esse cupom já não tem validade!.',
            ], 400);
        }

        if ($coupon->category_id) {
            return $this->categorySum($instance, $coupon, $productsWithDiscount);
        }

        if ($coupon->supplier_id) {
            return $this->supplierSum($instance, $coupon, $productsWithDiscount);
        }

        if ($coupon->brand_id) {
            return $this->brandSum($instance, $coupon, $productsWithDiscount);
        }

        if ($productCoupon) {
            return $this->productSum($instance, $coupon, $productsWithDiscount);
        }

        if ($coupon->buyer_id || $coupon->client_profile_id || $coupon->client_group_id) {
            return $this->buyerSum($instance, $coupon, $productsWithDiscount);
        }

        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;


        if ($coupon->discount_value !== null) {
            $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
            return response()->json([
                'success' => true,
                'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                'total_with_discount' => $totalWithDiscount,
                'discount' => $coupon->discount_value,
            ]);
        }

        if ($coupon->discount_porc !== null) {
            foreach ($instance->products as $product) {
                $productBase = Product::where('id', $product->product_id)->first();
                if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                    $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                } else {
                    $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                    $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                    $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                    $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                    $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                    $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                    $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                    $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                    $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                    $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    $difference = number_format($discount, 2);

                    $productsWithDiscount[] = [
                        'reference' => $productBase->reference,
                        'unit_price_with_ipi' => $differenceUnitWithDiscount,
                        'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                        '$unitformat' => $unitformat,
                        'subtotal_with_discount' => $subtotalWithDiscount,
                        'subtotal' => $subtotalWithDiscountWithoutIpi,
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $discount,
                    ];
                }
            }
            return response()->json([
                'success' => true,
                'message' => "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
                'discountFull' => $coupon->discount_porc,
                'products_with_discount' => $productsWithDiscount,
                'total_with_discount' => $totalWithDiscount,
                'discount' => $discount,
                'discount_Percentage' => $discountPercentage
            ]);
        }


        return response()->json([
            'success' => false,
            'message' => 'Não foi possível aplicar o desconto.',
        ], 400);
    }

    private function categorySum($instance, $coupon, $productsWithDiscount)
    {
        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;

        foreach ($instance->products as $product) {
            if ($coupon->category_id == $product->product->category_id) {
                if ($coupon->discount_value !== null) {
                    $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
                    $productsWithDiscount[] = [
                        'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $coupon->discount_value,
                    ];
                }

                if ($coupon->discount_porc !== null) {
                    $productBase = Product::where('id', $product->product_id)->first();
                    if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                        $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    } else {
                        $discountPercentage = $coupon->discount_porc / 100;
                        $subtotal = $productBase->getBaseValue() * $product->qty;
                        $value = $discountPercentage * $subtotal;
                        $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                        $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                        $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                        $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                        $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                        $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                        $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                        $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                        $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                        $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                        $totalWithDiscount -= $value;
                        $discount += $value;
                        $difference = number_format($discount, 2);

                        $productsWithDiscount[] = [
                            'reference' => $productBase->reference,
                            'unit_price_with_ipi' => $differenceUnitWithDiscount,
                            'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                            '$unitformat' => $unitformat,
                            'subtotal_with_discount' => $subtotalWithDiscount,
                            'subtotal' => $subtotalWithDiscountWithoutIpi,
                            'total_with_discount' => $totalWithDiscount,
                            'discount' => $discount,
                        ];
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
            'discountFull' => $coupon->discount_porc,
            'products_with_discount' => $productsWithDiscount,
            'total_with_discount' => $totalWithDiscount,
            'discount' => $discount,
            'discount_Percentage' => $discountPercentage
        ]);
    }

    private function supplierSum($instance, $coupon, $productsWithDiscount)
    {
        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;

        foreach ($instance->products as $product) {
            if ($coupon->supplier_id == $product->product->supplier_id) {
                if ($coupon->discount_value !== null) {
                    $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
                    $productsWithDiscount[] = [
                        'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $coupon->discount_value,
                    ];
                }

                if ($coupon->discount_porc !== null) {
                    $productBase = Product::where('id', $product->product_id)->first();
                    if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                        $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    } else {
                        $discountPercentage = $coupon->discount_porc / 100;
                        $subtotal = $productBase->getBaseValue() * $product->qty;
                        $value = $discountPercentage * $subtotal;
                        $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                        $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                        $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                        $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                        $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                        $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                        $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                        $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                        $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                        $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                        $totalWithDiscount -= $value;
                        $discount += $value;
                        $difference = number_format($discount, 2);

                        $productsWithDiscount[] = [
                            'reference' => $productBase->reference,
                            'unit_price_with_ipi' => $differenceUnitWithDiscount,
                            'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                            '$unitformat' => $unitformat,
                            'subtotal_with_discount' => $subtotalWithDiscount,
                            'subtotal' => $subtotalWithDiscountWithoutIpi,
                            'total_with_discount' => $totalWithDiscount,
                            'discount' => $discount,
                        ];
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
            'discountFull' => $coupon->discount_porc,
            'products_with_discount' => $productsWithDiscount,
            'total_with_discount' => $totalWithDiscount,
            'discount' => $discount,
            'discount_Percentage' => $discountPercentage
        ]);
    }

    private function brandSum($instance, $coupon, $productsWithDiscount)
    {
        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;

        foreach ($instance->products as $product) {
            if ($coupon->brand_id == $product->product->brand_id) {
                if ($coupon->discount_value !== null) {
                    $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
                    $productsWithDiscount[] = [
                        'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $coupon->discount_value,
                    ];
                }

                if ($coupon->discount_porc !== null) {
                    $productBase = Product::where('id', $product->product_id)->first();
                    if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                        $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    } else {
                        $discountPercentage = $coupon->discount_porc / 100;
                        $subtotal = $productBase->getBaseValue() * $product->qty;
                        $value = $discountPercentage * $subtotal;
                        $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                        $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                        $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                        $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                        $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                        $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                        $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                        $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                        $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                        $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                        $totalWithDiscount -= $value;
                        $discount += $value;
                        $difference = number_format($discount, 2);

                        $productsWithDiscount[] = [
                            'reference' => $productBase->reference,
                            'unit_price_with_ipi' => $differenceUnitWithDiscount,
                            'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                            '$unitformat' => $unitformat,
                            'subtotal_with_discount' => $subtotalWithDiscount,
                            'subtotal' => $subtotalWithDiscountWithoutIpi,
                            'total_with_discount' => $totalWithDiscount,
                            'discount' => $discount,
                        ];
                    }
                }
            }
        }
        return response()->json([
            'success' => true,
            "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
            'discountFull' => $coupon->discount_porc,
            'products_with_discount' => $productsWithDiscount,
            'total_with_discount' => $totalWithDiscount,
            'discount' => $discount,
            'discount_Percentage' => $discountPercentage
        ]);
    }

    private function productSum($instance, $coupon, $productsWithDiscount)
    {
        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;
        foreach ($instance->products as $product) {
            if ($coupon->product_id == $product->product_id) {
                if ($coupon->discount_value !== null) {
                    $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
                    $productsWithDiscount[] = [
                        'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $coupon->discount_value,
                    ];
                }

                if ($coupon->discount_porc !== null) {
                    $productBase = Product::where('id', $product->product_id)->first();
                    if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                        $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    } else {
                        $discountPercentage = $coupon->discount_porc / 100;
                        $subtotal = $productBase->getBaseValue() * $product->qty;
                        $value = $discountPercentage * $subtotal;
                        $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                        $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                        $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                        $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                        $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                        $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                        $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                        $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                        $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                        $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                        $totalWithDiscount -= $value;
                        $discount += $value;
                        $difference = number_format($discount, 2);

                        $productsWithDiscount[] = [
                            'reference' => $productBase->reference,
                            'unit_price_with_ipi' => $differenceUnitWithDiscount,
                            'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                            '$unitformat' => $unitformat,
                            'subtotal_with_discount' => $subtotalWithDiscount,
                            'subtotal' => $subtotalWithDiscountWithoutIpi,
                            'total_with_discount' => $totalWithDiscount,
                            'discount' => $discount,
                        ];
                    }
                }
            }
        }
        return response()->json([
            'success' => true,
            "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
            'discountFull' => $coupon->discount_porc,
            'products_with_discount' => $productsWithDiscount,
            'total_with_discount' => $totalWithDiscount,
            'discount' => $discount,
            'discount_Percentage' => $discountPercentage
        ]);
    }

    private function buyerSum($instance, $coupon, $productsWithDiscount)
    {
        $totalWithDiscount = $instance->products_sum_subtotal_with_ipi;
        $discount = 0;
        foreach ($instance->products as $product) {
            if ($coupon->discount_value !== null) {
                $totalWithDiscount = $instance->products_sum_subtotal_with_ipi - $coupon->discount_value;
                $productsWithDiscount[] = [
                    'message' => "Você ganhou " . $coupon->discount_value . " Reais de desconto",
                    'total_with_discount' => $totalWithDiscount,
                    'discount' => $coupon->discount_value,
                ];
            }

            if ($coupon->discount_porc !== null) {
                $productBase = Product::where('id', $product->product_id)->first();
                if ($productBase->unit_price_promotional != null || $productBase->box_price_promotional != null) {
                    $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $totalWithDiscount -= $value;
                    $discount += $value;
                } else {
                    $discountPercentage = $coupon->discount_porc / 100;
                    $subtotal = $productBase->getBaseValue() * $product->qty;
                    $value = $discountPercentage * $subtotal;
                    $unitformat = str_replace(',', '.', $product->unit_price_with_ipi);
                    $unitformatWithoutIpi = str_replace(',', '.', $product->unit_price);
                    $unitWithDiscountWithoutIpi = floatval($unitformatWithoutIpi) * (1 - $discountPercentage);
                    $unitWithDiscount = floatval($unitformat) * (1 - $discountPercentage);
                    $differenceUnitWithDiscountWithoutIpi = number_format($unitWithDiscountWithoutIpi, 2);
                    $differenceUnitWithDiscount = number_format($unitWithDiscount, 2);
                    $subtotalformatWithoutIpi = str_replace(['.', ','], ['', '.'], $product->subtotal);
                    $subtotalformat = str_replace(['.', ','], ['', '.'], $product->subtotal_with_ipi);
                    $subtotalWithDiscount = floatval($subtotalformat) * (1 - $discountPercentage);
                    $subtotalWithDiscountWithoutIpi = floatval($subtotalformatWithoutIpi) * (1 - $discountPercentage);
                    $totalWithDiscount -= $value;
                    $discount += $value;
                    $difference = number_format($discount, 2);

                    $productsWithDiscount[] = [
                        'reference' => $productBase->reference,
                        'unit_price_with_ipi' => $differenceUnitWithDiscount,
                        'unit_price' => $differenceUnitWithDiscountWithoutIpi,
                        '$unitformat' => $unitformat,
                        'subtotal_with_discount' => $subtotalWithDiscount,
                        'subtotal' => $subtotalWithDiscountWithoutIpi,
                        'total_with_discount' => $totalWithDiscount,
                        'discount' => $discount,
                    ];
                }
            }
        }
        return response()->json([
            'success' => true,
            "Você ganhou " . $coupon->discount_porc . "% de desconto no produto ",
            'discountFull' => $coupon->discount_porc,
            'products_with_discount' => $productsWithDiscount,
            'total_with_discount' => $totalWithDiscount,
            'discount' => $discount,
            'discount_Percentage' => $discountPercentage
        ]);
    }
}
