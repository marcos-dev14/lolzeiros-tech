<?php

namespace App\Models;

use App\Models\Contracts\HasImageInterface;
use App\Models\Views\AvailableProduct;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Znck\Eloquent\Traits\BelongsToThrough;

class Brand extends Model implements HasImageInterface
{
    use HasFactory, SoftDeletes, BelongsToThrough;

    public string $IMAGE_PATH = 'products/brands/{id}';

    public string $IMAGE_DIMENSIONS = '200x130';

    protected $table = 'product_brands';

    protected $fillable = [
        'name',
        'slug',
        'api_reference',
        'image',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function availableProducts(): HasMany
    {
        return $this->hasMany(AvailableProduct::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function supplier(): \Znck\Eloquent\Relations\BelongsToThrough
    {
        return $this->belongsToThrough(Supplier::class, Product::class);
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
    // Scopes
    //------------------------------------------------------------------
    public function scopeHasSupplier($query, $supplierId)
    {
        return $query->whereHas('products', function ($q) use ($supplierId) {
            $q->select(DB::raw('distinct brand_id'))->where('supplier_id', $supplierId);
        })->doesntHave('products', 'or');
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
