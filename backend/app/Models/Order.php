<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'old_id',
        'code',
        'origin',
        'installment_rule',
        'installment_rule_value',
        'fractional_box',
        'profile_discount',
        'payment_promotion_term_start',
        'count_products',
        'count_sum_products',
        'current_status',
        'lead_time',
        'shipping_company_id',
        'shipping_company_name',
        'total_value',
        'invoiced_value',
        'total_value_with_ipi',
        'total_discount',
        'coupon_discount_value',
        'coupon_discount_value_ipi',
        'installment_discount_value',
        'installment_discount_value_ipi',
        'coupon_id',
        'comments',
        'internal_comments',
        'client_id',
        'client_last_order',
        'address_street',
        'address_number',
        'address_complement',
        'address_district',
        'address_city',
        'country_city_id',
        'address_zipcode',
        'country_state_id',
        'address_state',
        'product_supplier_id',
        'product_supplier_name',
        'seller_id',
        'sale_channel_id',
        'order_type_id',
        'buyer_id',
        'buyer_name',
        'buyer_email',
        'buyer_cellphone',
        'icms',
        'external_order_id',
        'external_created_at',
        'created_at',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'product_supplier_id');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class, 'coupon_id');
    }

    public function clientGroup(): BelongsTo
    {
        return $this->belongsTo(ClientGroup::class, 'client_group_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function shippingCompany(): BelongsTo
    {
        return $this->belongsTo(ShippingCompany::class, 'shipping_company_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function orderStatuses(): HasMany
    {
        return $this->hasMany(OrderStatus::class, 'order_id');
    }

    public function saleChannel(): BelongsTo
    {
        return $this->belongsTo(SaleChannel::class, 'sale_channel_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(OrderType::class, 'order_type_id');
    }

    public function addressState(): BelongsTo
    {
        return $this->belongsTo(CountryState::class, 'country_state_id');
    }

    public function invoice(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeOpened($query)
    {
        return $query->whereDoesntHave('orderStatuses', function ($query) {
            $query->where('name', 'canceled')
                ->orWhere('name', 'billed');
        });
    }

    public function scopeCanceled($query)
    {
        return $query->whereHas('orderStatuses', function ($query) {
            $query->where('name', 'canceled');
        });
    }

    public function scopeClosed($query)
    {
        return $query->whereHas('orderStatuses', function ($query) {
            $query->where('name', 'billed');
        })->whereDoesntHave('orderStatuses', function ($query) {
            $query->where('name', 'canceled');
        });
    }

    public function scopeByClientName($query, $clientName)
    {
        return $query->whereHas('client', function ($query) use ($clientName) {
            $query->where('name', 'like', "%$clientName%")
                ->orWhere('company_name', 'like', "%$clientName%");
        });
    }

    public function scopeBySupplierName($query, $supplierName)
    {
        return $query->whereHas('supplier', function ($query) use ($supplierName) {
            $query->where('name', 'like', "%$supplierName%")
                ->orWhere('company_name', 'like', "%$supplierName%");
        });
    }

    public function scopeByAddressCityName($query, $cityName)
    {
        return $query->where('address_city', 'like', "%$cityName%");
    }

    public function scopeByClientDocument($query, $document)
    {
        return $query->whereHas('client', function ($query) use ($document) {
            $query->where('document', 'like', "%$document%");
        });
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getFormatedTotalValueAttribute(): string
    {
        return number_format($this->attributes['total_value'], 2, ',', '.');
    }

    public function getCurrentStatusAttribute(): ?string
    {
        return $this->attributes['current_status']
            ? (new OrderStatus())->statuses[$this?->attributes['current_status']] : null;
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getNewCode(): string
    {
        $order = $this;

        $origin = $order->origin ?? 'Website';
        $now = $order->created_at->format('my');

        $code = substr($origin, 0, 1);
        $code .= substr($order?->supplier?->name ?? 'Auge', 0, 2);
        $code .= $now;
        $code .= str_pad(substr($order->id, -4) ?? 1, 4, '0', STR_PAD_LEFT);

        return strtoupper($code);
    }
    public function getTotalValue()
    {
        $order = $this;
        $total_value = is_numeric($order->total_value) ? $order->total_value : stringToFloat($order->total_value);
        if ($order->coupon_discount_value != 0) {
            $total_value -= $order->coupon_discount_value;
        }
        if ($order->installment_discount_value != 0) {
            $total_value -= $order->installment_discount_value;
        }

        return $total_value;
    }
    public function getTotalValueWithIpi()
    {
        $order = $this;
        $total_value_with_ipi = is_numeric($order->total_value_with_ipi) ? $order->total_value_with_ipi : stringToFloat($order->total_value_with_ipi);
        if ($order->coupon_discount_value_ipi != 0) {
            $total_value_with_ipi -= $order->coupon_discount_value_ipi;
        }
        if ($order->installment_discount_value_ipi != 0) {
            $total_value_with_ipi -= $order->installment_discount_value_ipi;
        }

        return $total_value_with_ipi;
    }

    public function calculateDiscountSumOrder()
    {
        $order = $this;

        $discount = is_numeric($order->total_discount) ? $order->total_discount : stringToFloat($order->total_discount);
        if ($order->coupon_discount_value != 0) {
            $discount += $order->coupon_discount_value;
        }
        if ($order->installment_discount_value != 0) {
            $discount += $order->installment_discount_value;
        }

        return $discount;
    }
}
