<?php

namespace App\Models;

use AdamHopkinson\LaravelModelHash\Traits\ModelHash;
use App\Casts\Date;
use App\Casts\StringToDouble;
use App\Enums\Product\AvailabilityType;
use App\Models\Product as RelatedProduct;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use JetBrains\PhpStorm\ArrayShape;
use Znck\Eloquent\Traits\BelongsToThrough;

class Product extends Model
{
    use HasFactory, SoftDeletes, BelongsToThrough, ModelHash;

    const IMAGEABLE_PATH = 'products/gallery/{id}';

    const FILEABLE_PATH = 'products/files/{id}';

    const BASE_URL = 'produtos';

    protected $fillable = [
        'title',
        'slug',
        'api_reference',
        'searcheable',
        'image',
        'published_at',
        'replacement',
        'featured_until',
        'use_video',
        'youtube_link',
        'primary_text',
        'secondary_text',
        'embed_type',
        'embed_id',
        'inner_code',
        'reference',
        'ean13',
        'display_code',
        'dun14',
        'expiration_date',
        'origin',
        'release_year',
        'catalog_name',
        'catalog_page',
        'gender',
        'size_height',
        'size_width',
        'size_length',
        'size_cubic',
        'size_weight',
        'packing_type',
        'box_height',
        'box_width',
        'box_length',
        'box_cubic',
        'box_weight',
        'box_packing_type',
        'unit_price',
        'unit_price_promotional',
        'unit_minimal',
        'unit_subtotal',
        'availability',
        'expected_arrival',
        'box_price',
        'box_price_promotional',
        'box_minimal',
        'box_subtotal',
        'ipi',
        'ncm',
        'cst',
        'icms',
        'cfop',
        'certification',
        'age_group',
        'seo_title',
        'seo_tags',
        'seo_description',
        'qrcode_color',
        'qrcode_custom_title',
        'qrcode_title',
        'qrcode_image1',
        'qrcode_image2',
        'views',
        'sales',
        'packaging',
        'category_id',
        'supplier_id',
        'brand_id',
        'badge_id',
        'attribute_category_id',
    ];

    protected $dates = ['published_at', 'expiration_date', 'featured_until', 'expected_arrival'];

    protected $casts = [
        'unit_subtotal' => StringToDouble::class,
        'box_subtotal' => StringToDouble::class,
        'cst' => StringToDouble::class,
        'size_height' => StringToDouble::class,
        'size_width' => StringToDouble::class,
        'size_length' => StringToDouble::class,
        'size_weight' => StringToDouble::class,
        'box_height' => StringToDouble::class,
        'box_width' => StringToDouble::class,
        'box_length' => StringToDouble::class,
        'box_weight' => StringToDouble::class,
        'icms' => StringToDouble::class,
        'ipi' => StringToDouble::class,
        'unit_price' => StringToDouble::class,
        'unit_price_promotional' => StringToDouble::class,
        'box_price' => StringToDouble::class,
        'box_price_promotional' => StringToDouble::class,
        'expected_arrival' => Date::class,
    ];

    public array $validationRules = [
        'title' => 'sometimes|required',
        'ean13' => 'nullable|alpha_num|size:13',
        'display_code' => 'nullable|alpha_num|size:13',
        'dun14' => 'nullable|alpha_num|size:14',
        'ncm' => 'nullable|size:8',
        'unit_price' => 'sometimes|nullable|numeric|min:0.1',
        'unit_price_promotional' => 'nullable|numeric|min:0.01',
        'box_price' => 'sometimes|required|numeric|min:0.01',
        'box_price_promotional' => 'nullable|numeric|min:0.01',
        'catalog_page' => 'nullable|numeric|between:1,9999',
        'box_minimal' => 'nullable|numeric|between:1,9999',
        'unit_minimal' => 'sometimes|nullable|between:1,9999',
        'reference' => 'nullable|alpha_dash',
        'badge_id' => 'nullable|integer|exists:product_badges,id',
        'brand_id' => 'nullable|integer|exists:product_brands,id,deleted_at,NULL',
        'supplier_id' => 'integer|exists:product_suppliers,id,deleted_at,NULL',
        'embed_id' => 'nullable|integer',
        'category_id' => 'integer|exists:product_categories,id,deleted_at,NULL',
        'attribute_category_id' => 'integer|nullable|exists:product_attribute_categories,id,deleted_at,NULL',
    ];

    protected string $hashName = 'inner_code';

    protected bool $useHashInRoutes = false;

    /**
     * @return string[]
     */
    public function getFillable(): array
    {
        return $this->fillable;
    }

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(GalleryImage::class, 'imageable');
    }

    public function route(): MorphOne
    {
        return $this->morphOne(Route::class, 'routable');
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function attributeCategory(): BelongsTo
    {
        return $this->belongsTo(AttributeCategory::class, 'attribute_category_id', 'id');
    }

    public function pAttributes(): BelongsToMany
    {
        return $this->belongsToMany(
            Attribute::class,
            'product_has_attributes',
            'product_id',
            'attribute_id'
        )->using(ProductAttribute::class)->withPivot('order', 'value');
    }

    public function validAttrs(): BelongsToMany
    {
        return $this->pAttributes()->wherePivot('value', '!=');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'embed_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'embed_id');
    }

    public function related(): BelongsToMany
    {
        return $this->belongsToMany(
            RelatedProduct::class,
            'product_related',
            'product_id',
            'product_related_id'
        );
    }

    public function variations(): BelongsToMany
    {
        return $this->belongsToMany(
            RelatedProduct::class,
            'product_variations',
            'product_id',
            'product_related_id'
        );
    }

    public function promotions(): MorphMany
    {
        return $this->morphMany(SupplierPromotion::class, 'promotable');
    }

    public function coupons(): HasMany
    {
        $client = $this->getSelectedClientOfLoggedInBuyer();
        $query = Coupon::where('validate', '>', now());

        if ($client) {
            $couponIds = $query->where(function ($query) use ($client) {
                $query->whereNull('buyer_id')
                    ->whereNull('seller_id')
                    ->whereNull('client_group_id')
                    ->whereNull('client_id')
                    ->whereNull('client_profile_id');
            })->orWhere(function ($query) use ($client) {
                $query->where(function ($query) use ($client) {
                    $query->where('buyer_id', $client->group->buyer_id)
                        ->orWhereNull('buyer_id');
                })->where(function ($query) use ($client) {
                    $query->where('seller_id', $client->seller_id)
                        ->orWhereNull('seller_id');
                })->where(function ($query) use ($client) {
                    $query->where('client_id', $client->id)
                        ->orWhereNull('client_id');
                })->where(function ($query) use ($client) {
                    $query->where('client_group_id', $client->client_group_id)
                        ->orWhereNull('client_group_id');
                })->where(function ($query) use ($client) {
                    $query->where('client_profile_id', $client->profile->id)
                        ->orWhereNull('client_profile_id');
                });
            })->pluck('id');

            $usedCouponIds = CouponStatus::where('client_id', $client->id)
                ->whereIn('coupon_id', $couponIds)
                ->pluck('coupon_id');

            return $this->hasMany(Coupon::class)
                ->whereIn('id', $couponIds)
                ->whereNotIn('id', $usedCouponIds)
                ->where('validate', '>', now());
        } else {
            return $this->hasMany(Coupon::class)
                ->where('validate', '>', now())
                ->whereNull('buyer_id')
                ->whereNull('seller_id')
                ->whereNull('client_group_id')
                ->whereNull('client_profile_id');
        }
    }


    //------------------------------------------------------------------
    // Scope
    //------------------------------------------------------------------
    public function scopePublished($query)
    {
        return $query
            ->where('title', '!=', '')
            ->whereNotNull('category_id')
            ->whereNotNull('brand_id')
            ->whereNotNull('box_price')->where('box_price', '>', 0.0)
            ->whereNotNull('box_minimal')->where('box_minimal', '>', 0.0)
            ->whereNotNull('cst')
            ->whereNotNull('ean13')->where('ean13', '!=', '')
            ->whereNotNull('ipi')
            ->whereNotNull('ncm')->where('ncm', '!=', '')
            ->where('published_at', '<=', Carbon::now())
            ->notUnavailable()
            ->hasImage();
    }

    public function scopeNotUnavailable($query)
    {
        return $query->where('availability', '!=', AvailabilityType::OUT_OF_LINE()->value)
            ->where('availability', '!=', AvailabilityType::IN_REGISTRATION()->value);
    }

    public function scopeAvailable($query)
    {
        return $query->where('availability', AvailabilityType::AVAILABLE()->value);
    }

    public function scopeHasImage($query)
    {
        return $query->whereHas('images');
    }

    public function scopeHasRelated($query)
    {
        return $query->whereHas('related');
    }

    public function scopeHasPromotion($query)
    {
        return $query->where('unit_price_promotional', '!=', null)->orWhere('box_price_promotional', '!=', null);
    }

    public function scopeHasEmbed($query)
    {
        return $query->whereHas('product')->orWhereHas('post');
    }

    public function scopeLike($query, $field, $value)
    {
        $query->where($field, 'like', "%$value%");
    }

    public function scopefieldEmptyOrInvalid($query, $field)
    {
        $query->whereNull($field)
            ->orWhere($field, 0.0)
            ->orWhere($field, 'like', '%ERRO%');
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setTitleAttribute($title): string
    {
        return $this->attributes['title'] = ucwords(mb_strtolower($title));
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getUrlAttribute(): string
    {
        return "produtos/$this->slug/$this->id";
    }

    public function getCover(): ?GalleryImage
    {
        return $this->images->first();
    }

    public function getDiscountedPriceAttributeOld(): ?string
    {
        return $this->getPrice(false);
    }

    public function getInCartDataAttribute(): array
    {
        $sessionProductsInCart = session('cart.products');

        return $sessionProductsInCart?->where('product_id', $this->id)->first() ?? [];
    }

    public function getDiscountPercentage(?int $quantity = null): float
    {
        return getDiffPercentage($this->getBasePercent(), $this->getBaseValueWithPromotions($quantity));
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function generateUrl(): string
    {
        $baseUrl = self::BASE_URL;
        $supplierSlug = '';
        $categorySlug = '';

        $supplier = $this->getProductSupplier($this);
        if ($supplier) {
            $supplierSlug = "/$supplier->slug";
        }

        $category = $this->category;
        if ($category) {
            $categorySlug = "/$category->slug";
        }

        $baseUrl .= $supplierSlug . $categorySlug . "/$this->slug";

        return $baseUrl;
    }

    public function canBeFractionated(?ClientProfile $clientProfile = null): bool
    {
        $supplier = $this->getProductSupplier($this);
        if (!$supplier || !$supplier->fractional_box) {
            return false;
        }

        if (is_null($clientProfile)) {
            $clientProfile = optional($this->getSelectedClientOfLoggedInBuyer())->profile;
        }

        $supplierProfileFractionation = $supplier->fractionations
            ->where('client_profile_id', optional($clientProfile)->id)
            ->first();

        return $supplierProfileFractionation && $supplierProfileFractionation->enable;
    }

    protected function getPreferredValueField(?Client $client, Product $product): string
    {
        if (!$client) {
            return 'box_price';
        }

        $canBeFractionated = $product->canBeFractionated($client->profile);

        return $canBeFractionated ? 'unit_price' : 'box_price';
    }

    protected function getPromotionalValue(Product $product, string $priceField): ?float
    {
        $promotionalValue = $product["{$priceField}_promotional"];
        $value = $product[$priceField];
        $isValidPromotionalValue = $promotionalValue < $value;

        return $isValidPromotionalValue ? $product["{$priceField}_promotional"] : null;
    }

    protected function applyIcmsToPrice(Client $client, ?Supplier $supplier, float $basePrice): float
    {
        $clientMainAddress = $client->getMainAddress();

        if (!$clientMainAddress || is_null($supplier) || !count($supplier->stateDiscounts)) {
            return $basePrice;
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
            $stateDiscountValue = ($basePrice * ($stateDiscountPercentage / 100));
            $basePrice -= $stateDiscountValue;
        }

        if ($stateAdditionalPercentage) {
            $stateAdditionalValue = ($basePrice * ($stateAdditionalPercentage / 100));
            $basePrice += $stateAdditionalValue;
        }

        return $basePrice;
    }

    protected function applyProfileDiscountsToPrice(
        ?ClientProfile $clientProfile,
        Supplier $supplier,
        float $basePrice
    ): float {
        //print($basePrice.'b-');
        if (!$clientProfile) {
            return $basePrice;
        }

        // Desconto por perfil
        $supplierProfileDiscounts = $supplier->profileDoesntHaveCategoryDiscounts
            ->where('client_profile_id', $clientProfile->id);

        if ($supplierProfileDiscounts->count()) {
            $profileDiscountPercentage = floatval($supplierProfileDiscounts->sum('discount_value'));
            $basePrice -= ($basePrice * ($profileDiscountPercentage / 100));
        }
        //print($basePrice.'p-');
        return $basePrice;
    }

    protected function applyProfilePromotionsToPrice(
        ?ClientProfile $clientProfile,
        Supplier $supplier,
        float $basePrice,
        ?int $productCategoryId
    ): float {
        if (!$clientProfile) {
            return $basePrice;
        }

        // Desconto por perfil por categoria
        $supplierCategoriesDiscounts = $supplier->profileHasCategoryDiscounts
            ->where('client_profile_id', $clientProfile->id)
            ->filter(fn($item) => $item->categories->pluck('id')->contains($productCategoryId));

        if ($supplierCategoriesDiscounts->count()) {
            $categoryDiscountPercentage = floatval($supplierCategoriesDiscounts->sum('discount_value'));
            $basePrice -= ($basePrice * ($categoryDiscountPercentage / 100));
        }
        return $basePrice;
    }

    protected function applyQuantityPromotionsToPrice(
        Client $client,
        Product $product,
        float $basePrice,
        Supplier $supplier,
        ?int $quantity = null
    ): float {
        $quantity = $quantity ?? $product->getMinimalQuantity($client);

        $categoryPromotions = $product->getCategoryQuantityPromotions($product, $quantity, $supplier);
        $productPromotions = $product->getProductQuantityPromotions($product, $quantity, $supplier);

        $initialPrice = $basePrice;

        $firstProductPromotion = $productPromotions->first();
        if ($firstProductPromotion) {
            $productPromotionDiscount = $basePrice * (($firstProductPromotion->discount_value) / 100);
            $initialPrice -= $productPromotionDiscount;
        }

        $firstCategoryPromotion = $categoryPromotions->first();
        if ($firstCategoryPromotion) {
            $categoryPromotionDiscount = $basePrice * (($firstCategoryPromotion->discount_value) / 100);
            $initialPrice -= $categoryPromotionDiscount;
        }

        return $initialPrice;
    }

    public function getBaseValue(): float
    {
        $product = $this;

        // Obtém o cliente pelo comprador logado
        $client = $this->getSelectedClientOfLoggedInBuyer();

        // Campo de preço (caixa ou fracionado)
        $preferredPriceField = $this->getPreferredValueField($client, $product);

        // Pega o preço promocional do campo acima
        $promotionalPrice = $this->getPromotionalValue($product, $preferredPriceField);

        // Define o preço base sem alterações
        $price = $product[$preferredPriceField] ?? 0.0;

        // Se tiver preço promocional, retorna o preço promocional
        /* if (!empty($promotionalPrice) || !$client instanceof Client) {
            return $price;
        } */

        // Obtém o fornecedor do produto
        $product->loadMissing('supplier');
        $productSupplier = $this->getProductSupplier($product);

        if ($client instanceof Client) {
            // Aplica ICMS ao preço base
            $priceWithIcms = $this->applyIcmsToPrice($client, $productSupplier, $price);

            // Aplica desconto por perfil
            return $this->applyProfileDiscountsToPrice($client->profile, $productSupplier, $priceWithIcms);
        } else {
            return $price;
        }
    }

    public function getBaseValuePromotion(): float
    {
        $product = $this;

        // Obtém o cliente pelo comprador logado
        $client = $this->getSelectedClientOfLoggedInBuyer();

        // Campo de preço (caixa ou fracionado)
        $preferredPriceField = $this->getPreferredValueField($client, $product);

        // Pega o preço promocional do campo acima
        $promotionalPrice = $this->getPromotionalValue($product, $preferredPriceField);

        // Define o preço base sem alterações
        $price = $product[$preferredPriceField] ?? 0.0;

        // Se tiver preço promocional, retorna o preço promocional
        /* if (!empty($promotionalPrice) || !$client instanceof Client) {
            return $price;
        } */

        // Obtém o fornecedor do produto
        $product->loadMissing('supplier');
        $productSupplier = $this->getProductSupplier($product);

        // Aplica ICMS ao preço base
        $priceWithIcms = $this->applyIcmsToPrice($client, $productSupplier, $price);

        // Aplica desconto por perfil
        return $this->applyProfileDiscountsToPrice($client->profile, $productSupplier, $priceWithIcms);
    }

    public function getBasePercent(): float
    {
        $product = $this;

        // Obtém o cliente pelo comprador logado
        $client = $this->getSelectedClientOfLoggedInBuyer();

        // Campo de preço (caixa ou fracionado)
        $preferredPriceField = $this->getPreferredValueField($client, $product);

        // Pega o preço promocional do campo acima
        $promotionalPrice = $this->getPromotionalValue($product, $preferredPriceField);

        // Define o preço base sem alterações
        $price = $product[$preferredPriceField] ?? 0.0;

        // Obtém o fornecedor do produto
        $product->loadMissing('supplier');
        $productSupplier = $this->getProductSupplier($product);

        // Aplica ICMS ao preço base
        $priceWithIcms = $this->applyIcmsToPrice($client, $productSupplier, $price);

        // Aplica desconto por perfil
        return $this->applyProfileDiscountsToPrice($client->profile, $productSupplier, $priceWithIcms);
    }

    public function getBaseValueWithPromotions(?int $quantity = null): float
    {
        $product = $this;

        // Obtém o cliente pelo comprador logado
        $client = $this->getSelectedClientOfLoggedInBuyer();

        // Campo de preço (caixa ou fracionado)
        $preferredPriceField = $this->getPreferredValueField($client, $product);

        // Pega o preço promocional do campo acima
        $promotionalPrice = $this->getPromotionalValue($product, $preferredPriceField);

        // Se tiver preço promocional, retorna o preço promocional
        if (!empty($promotionalPrice) || !$client instanceof Client) {
            return $promotionalPrice ?? 0;
        }

        $price = $this->getBaseValue();

        // Obtém o fornecedor do produto
        $productSupplier = $this->getProductSupplier($product);

        // Aplica promoções por perfil
        $priceWithProfilePromotions = $this->applyProfilePromotionsToPrice(
            $client->profile,
            $productSupplier,
            $price,
            $product->category_id
        );

        // Aplica promoções por quantidade comprada (quantidade mínima)
        return $this->applyQuantityPromotionsToPrice(
            $client,
            $product,
            $priceWithProfilePromotions,
            $productSupplier,
            $quantity
        );
    }

    public function getPriceField(): string
    {
        $product = $this;

        $initialPriceField = $product->box_price > 0.00 ? 'box_price' : 'unit_price';

        $client = $this->getSelectedClientOfLoggedInBuyer();

        if (!$client) {
            return $initialPriceField;
        }

        $canBeFractionated = $product->canBeFractionated($client->profile);
        $preferredPriceField = $canBeFractionated ? 'unit_price' : 'box_price';

        return $product["{$preferredPriceField}_promotional"] > 0.0
            ? "{$preferredPriceField}_promotional"
            : $preferredPriceField;
    }

    #[ArrayShape([
        'qty' => 'int|mixed|null',
        'ipi' => 'float|mixed|null',
        'unit_price' => 'float|int|mixed',
        'unit_price_with_ipi' => 'float|int|mixed',
        'original_price' => 'float',
        'subtotal' => 'float|int',
        'subtotal_with_ipi' => 'float|int',
        'discount' => 'float|int',
        'discount_percentage' => 'float|int',
        'price_difference' => 'float|int',
    ])]
    public function getPriceWithPromotionDiscounts(?int $quantity = null): array
    {
        $product = $this;
        $client = $this->getSelectedClientOfLoggedInBuyer();
        $quantity = $quantity ?? $product->getMinimalQuantity($client);
        $cacheKey = "getPriceWithPromotionDiscount_{$product->id}_$quantity";

        Cache::forget($cacheKey);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($product, $quantity) {
            $unitPrice = $product->getBaseValueWithPromotions($quantity);
            $ipi = $product->ipi;
            $ipiValue = $ipi > 0 ? $unitPrice * ($ipi / 100) : 0;
            $originalPrice = $product->getBaseValue();
            $discountTotal = $originalPrice - $unitPrice;

            $subtotal = $unitPrice * $quantity;
            $subtotalWithIpi = ($unitPrice + $ipiValue) * $quantity;

            return [
                'qty' => $quantity,
                'ipi' => floatval($ipi),
                'unit_price' => $unitPrice,
                'original_price' => $originalPrice,
                'unit_price_with_ipi' => $unitPrice + $ipiValue,
                'subtotal' => $subtotal,
                'subtotal_with_ipi' => $subtotalWithIpi,
                'discount' => $discountTotal > 0 ? ($discountTotal * $quantity) : 0.0,
                'discount_percentage' => getDiffPercentage($originalPrice, $unitPrice),
                'price_difference' => $discountTotal === 0.0
                    ? 0 : ($originalPrice * $quantity) - $subtotal,
            ];
        });
    }

    public function getSelectedClientOfLoggedInBuyer()
    {
        $buyer = auth()->guard('buyer')->user();

        if (!$buyer) {
            return null;
        }

        $sessionSelectedClient = session('buyer.clients.selected');

        return $sessionSelectedClient ?? $buyer->clients()->with('profile', 'addresses')?->first();
    }

    public function getMinimalQuantity(?Client $selectedClient = null)
    {
        $product = $this;
        $minimalQuantity = 1;

        $selectedClient = $selectedClient ?? $this->getSelectedClientOfLoggedInBuyer();
        if (!$selectedClient) {
            return $product->unit_minimal ?? $minimalQuantity;
        }

        $canBeFractionated = $product->canBeFractionated($selectedClient->profile);
        $minimalQuantity = $canBeFractionated ? $product->unit_minimal : $product->box_minimal;

        return $minimalQuantity ?? 1;
    }

    public function canBeSold(): bool|string
    {
        $supplier = $this->getProductSupplier($this);

        $selectedClient = session('buyer.clients.selected');
        $supplierId = $supplier?->id;
        $clientId = !empty($selectedClient['id']) ? $selectedClient['id'] : '';
        $cacheKey = 'PRODUCT_CAN_BE_SOLD';
        if (!empty($supplierId))
            $cacheKey .= "_$supplierId";
        if (!empty($clientId))
            $cacheKey .= "_$clientId";
        $cacheKey .= "_$this?->id";

        //Cache::forget($cacheKey);

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($supplier, $selectedClient) {
            if ($selectedClient instanceof Client) {
                if (!$supplier) {
                    return false;
                }

                if ($this->availability === AvailabilityType::IN_REGISTRATION) {
                    return 'Produto em cadastramento';
                }

                if ($this->availability === AvailabilityType::OUT_OF_LINE) {
                    return 'Produto fora de linha';
                }

                if ($this->availability === AvailabilityType::UNAVAILABLE) {
                    return 'Ops, não temos este produto em estoque no momento e estamos trabalhando para regularizar isto!';
                }

                $clientCanBuy = $selectedClient->canBuyFromSupplier($supplier);
                if (!$clientCanBuy['can']) {
                    return $clientCanBuy['reason_why'];
                }
            }

            return true;
        });
    }

    public function getProductQuantityPromotions(?Product $product = null, $qty = 0, ?Supplier $supplier = null)
    {
        $product = $product ?? $this;
        $supplier = $supplier ?? $this->getProductSupplier($product);
        $productId = $product->id;

        return $supplier->promotions()->valid()->whereHas(
            'products',
            function ($query) use ($productId, $qty) {
                $query->where('id', $productId);

                if ($qty !== 0) {
                    $query->where('min_quantity', '<=', $qty);
                }
            }
        )->orderByDesc('min_quantity')->get();
    }

    public function getCategoryQuantityPromotions(Product $product = null, $qty = 0, ?Supplier $supplier = null)
    {
        $product = $product ?? $this;
        $supplier = $supplier ?? $this->getProductSupplier($product);
        $productCategoryId = $product->category_id;

        $cacheKey = "CATEGORY_QTY_PROMOTION_{$qty}_$productCategoryId";

        return Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($supplier, $productCategoryId, $qty) {
                return $supplier->promotions()->valid()->whereHas(
                    'categories',
                    function ($query) use ($productCategoryId, $qty) {
                        $query->where('id', $productCategoryId);

                        if ($qty !== 0) {
                            $query->where('min_quantity', '<=', $qty);
                        }
                    }
                )->orderByDesc('min_quantity')->get();
            }
        );
    }

    public function getPrimaryTextAttribute(): string|null
    {
        $text = str_replace('oembed', 'iframe', $this->attributes['primary_text']);
        $text = str_replace('iframe url', 'iframe src', $text);
        $text = str_replace('<iframe', '<div class="iframe-container"><iframe', $text);

        return str_replace('</iframe>', '</iframe></div>', $text);
    }

    public function getSecondaryTextAttribute(): string|null
    {
        $text = str_replace('oembed', 'iframe', $this->attributes['secondary_text']);
        $text = str_replace('iframe url', 'iframe src', $text);
        $text = str_replace('<iframe', '<div class="iframe-container"><iframe', $text);

        return str_replace('</iframe>', '</iframe></div>', $text);
    }

    protected function getProductSupplier($product)
    {
        $availableSuppliers = session('filters.suppliers.available');

        $supplier = $availableSuppliers?->firstWhere('id', $product->supplier_id);

        if (!$supplier instanceof Supplier) {
            $product->loadMissing('supplier');
            $supplier = $product->supplier;
        }

        return $supplier;
    }
}
