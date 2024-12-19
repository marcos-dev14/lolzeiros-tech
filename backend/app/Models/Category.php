<?php

namespace App\Models;

use App\Models\Views\AvailableProduct;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_categories';

    protected $fillable = [
        'name',
        'slug',
        'order',
        'reference',
        'supplier_id',
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

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(SupplierPromotion::class);
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getUrlAttribute(): string
    {
        return "?rp=$this->supplier_id&ca=[$this->id]";
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getNextOrder($supplierId): int
    {
        $lastOrder = $this->select('order')
            ->where('supplier_id', $supplierId)
            ->orderBy('order', 'desc')
            ->first();

        return $lastOrder ? $lastOrder->order + 1 : 0;
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
