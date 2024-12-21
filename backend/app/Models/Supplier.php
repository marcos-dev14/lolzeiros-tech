<?php

namespace App\Models;

use App\Casts\Boolean;
use App\Models\Contracts\Addressable;
use App\Models\Contracts\Bankable;
use App\Models\Contracts\Contactable;
use App\Models\Contracts\HasImageInterface;
use App\Models\Traits\HasAddresses;
use App\Models\Traits\HasBankAccounts;
use App\Models\Traits\HasContacts;
use App\Models\Views\AvailableProduct;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use LaravelIdea\Helper\App\Models\_IH_Product_QB;

class Supplier extends Model implements HasImageInterface, Contactable, Addressable, Bankable
{
    use HasFactory, SoftDeletes, HasContacts, HasAddresses, HasBankAccounts;

    public string $IMAGE_PATH = 'products/suppliers/{id}';

    public string $IMAGE_DIMENSIONS = '200x130';

    protected $table = 'product_suppliers';

    protected $fillable = [
        'company_name',
        'name',
        'slug',
        'image',
        'is_available',
        'document',
        'document_status',
        'state_registration',
        'code',
        'activity_start',
        'status',
        'auge_register',
        'corporate_email',
        'website',
        'instagram',
        'facebook',
        'youtube',
        'twitter',
        'suspend_sales',
        'commercial_status',
        'order_schedule',
        'order_balance',
        'enter_price_on_order',
        'can_migrate_service',
        'auto_observation_order',
        'last_imported_at',
        'last_but_one_imported_at',
        'min_ticket',
        'min_order',
        'fractional_box',
        'allows_reservation',
        'client_mei_value',
        'client_vip_value',
        'client_premium_value',
        'client_platinum_value',
        'discount_type',
        'service_migrate',
        'lead_time_id',
        'shipping_type_id',
        'tax_regime_id',
        'blog_post_id',
        'updated_at',
    ];

    protected $casts = [
        'is_available' => Boolean::class,
        'activity_start' => 'datetime',
        'auge_register' => 'datetime',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(
            Product::class,
            Category::class,
            'supplier_id',
            'category_id',
            'id',
            'id'
        );
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


    public function availableProducts(): HasManyThrough
    {
        return $this->hasManyThrough(
            AvailableProduct::class,
            Category::class,
            'supplier_id',
            'category_id',
            'id',
            'id'
        );
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function phones(): HasMany
    {
        return $this->hasMany(SupplierPhone::class);
    }

    public function leadTime(): BelongsTo
    {
        return $this->belongsTo(LeadTime::class, 'lead_time_id');
    }

    public function shippingType(): BelongsTo
    {
        return $this->belongsTo(ShippingType::class, 'shipping_type_id');
    }

    public function taxRegime(): BelongsTo
    {
        return $this->belongsTo(TaxRegime::class);
    }

    public function paymentPromotions(): HasMany
    {
        return $this->hasMany(SupplierPaymentPromotion::class);
    }

    public function installmentRules(): HasMany
    {
        return $this->hasMany(SupplierInstallmentRule::class);
    }

    public function stateDiscounts(): HasMany
    {
        return $this->hasMany(SupplierDiscount::class)
            ->where('type', 'state_discount')
            ->doesntHave('categories');
    }

    public function profileDiscounts(?int $clientProfileId = null): HasMany
    {
        $query = $this->hasMany(SupplierDiscount::class)
            ->where('type', 'profile_discount');

        if ($clientProfileId) {
            $query->where('client_profile_id', $clientProfileId);
        }

        return $query;
    }

    public function profileDoesntHaveCategoryDiscounts(): HasMany
    {
        return $this->profileDiscounts()->doesntHave('categories');
    }

    public function profileHasCategoryDiscounts(): HasMany
    {
        return $this->profileDiscounts()->whereHas('categories');
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(SupplierPromotion::class);
    }

    public function commissionRules(): BelongsToMany
    {
        return $this->belongsToMany(
            CommissionRule::class,
            'supplier_commission_rules',
            'supplier_id',
            'commission_rule_id'
        );
    }

    public function blockedStates(): BelongsToMany
    {
        return $this->belongsToMany(
            CountryState::class,
            'supplier_blocked_states',
            'supplier_id',
            'country_state_id'
        );
    }

    public function blogPost(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class);
    }

    public function blockingRules(): BelongsToMany
    {
        return $this->belongsToMany(
            BlockingRule::class,
            'supplier_has_blocking_rules',
            'supplier_id',
            'blocking_rule_id'
        );
    }

    public function blockedRegions(): BelongsToMany
    {
        return $this->belongsToMany(
            BlockingRule::class,
            'supplier_blocked_regions',
            'supplier_id',
            'client_region_id'
        );
    }

    public function fractionations(): HasMany
    {
        return $this->hasMany(SupplierProfileFractionations::class, 'product_supplier_id');
    }

    public function blockedSuppliers()
    {
        return $this->hasMany(BlockedSupplier::class)
            ->with('seller');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeIsAvailable($query)
    {
        return $query->where('is_available', 1)->has('installmentRules');
    }

    public function scopeSelling($query)
    {
        return $query->where('suspend_sales', 0);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getImagePathAttribute(): string|null
    {
        $path = str_replace('{id}', $this->id, $this->IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        return Storage::exists($path)
            ? asset(Storage::url($path))
            : null;
    }

    public function getImagePath(): string|null
    {
        $path = str_replace('{id}', $this->id, $this->IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        return $path;
    }

    public function getWebpImageAttribute()
    {
        return (str_contains($this->image, 'default'))
            ? $this->image
            : str_replace('jpg', 'webp', $this->image);
    }

    public function getMaxInstallmentsAttribute(): ?int
    {
        $maxInstallments = 0;

        foreach ($this->installmentRules as $installmentRule) {
            $installmentsString = $installmentRule->installments;
            $installmentsArray = explode('/', $installmentsString);
            $numInstallments = count($installmentsArray);

            if ($numInstallments > $maxInstallments) {
                $maxInstallments = $numInstallments;
            }
        }

        return $maxInstallments > 0 ? $maxInstallments : null;
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
}
