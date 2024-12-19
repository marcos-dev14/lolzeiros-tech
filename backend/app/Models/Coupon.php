<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'description',
        'discount_value',
        'discount_porc',
        'price',
        'price_type',
        'created_at',
        'used',
        'period',
        'buyer_id',
        'client_id',
        'product_id',
        'brand_id',
        'category_id',
        'seller_id',
        'shipping_company_id',
        'client_group_id',
        'supplier_id',
        'client_profile_id',
        'validate',
        'type'
    ];

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function shipping(): BelongsTo
    {
        return $this->belongsTo(ShippingCompany::class, 'shipping_company_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function clientGroup(): BelongsTo
    {
        return $this->belongsTo(ClientGroup::class, 'client_group_id');
    }

    public function statuses(): HasMany
    {
        return $this->HasMany(CouponStatus::class);
    }

}
