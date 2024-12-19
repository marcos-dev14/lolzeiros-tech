<?php

namespace App\Models;

use App\Casts\Money;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class OrderProduct extends Model
{
    const IMAGEABLE_PATH = 'products/gallery/{id}';

    use SoftDeletes;

    protected $fillable = [
        'title',
        'reference',
        'image',
        'qty',
        'ipi',
        'unit_price',
        'unit_price_with_ipi',
        'original_price',
        'subtotal',
        'subtotal_with_ipi',
        'discount',
        'coupon_discount_unit',
        'coupon_discount_unit_ipi',
        'coupon_discount_value',
        'coupon_discount_value_ipi',
        'installment_discount_value',
        'installment_discount_value_ipi',
        'installment_discount_unit',
        'installment_discount_unit_ipi',
        'fractionated',
        'product_id',
        'order_id',
    ];

    public $casts = [
        'unit_price' => Money::class,
        'discount' => Money::class,
        'original_price' => Money::class,
        'subtotal' => Money::class,
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getImageAttribute(): string
    {
        $path = str_replace('{id}', $this->product_id, self::IMAGEABLE_PATH);

        $file = "$path/{$this->attributes['image']}";

        if (config('app.env') !== 'production') {
            $file = "public/$file";
        }

        return Storage::exists($file)
            ? Storage::url($file)
            : asset('images/default/product/default.jpg');
    }

    public function getWebpImageAttribute()
    {
        return (str_contains($this->image, 'default'))
            ? $this->image
            : str_replace('jpg', 'webp', $this->image);
    }

    public function getThumbAttribute(): string
    {
        $path = str_replace('{id}', $this->product_id, self::IMAGEABLE_PATH);

        $file = "$path/thumbs/{$this->attributes['image']}";

        if (config('app.env') !== 'production') {
            $file = "public/$file";
        }

        return Storage::exists($file)
            ? Storage::url($file)
            : asset('images/default/product/thumb-default.jpg');
    }

    public function getWebpThumbAttribute()
    {
        return (str_contains($this->thumb, 'default'))
            ? $this->thumb
            : str_replace('jpg', 'webp', $this->thumb);
    }

    public function getUnitPrice()
    {
        $product = $this;
        $unit_price = is_numeric($product->unit_price) ? $product->unit_price : stringToFloat($product->unit_price);
        if ($product->coupon_discount_unit != 0) {
            $unit_price -= $product->coupon_discount_unit;
        }
        if ($product->installment_discount_unit != 0) {
            $unit_price -= $product->installment_discount_unit;
        }

        return $unit_price;
    }

    public function getUnitPriceWithIpi()
    {
        $product = $this;
        $unit_price_with_ipi = is_numeric($product->unit_price_with_ipi) ? $product->unit_price_with_ipi : stringToFloat($product->unit_price_with_ipi);
        if ($product->coupon_discount_unit_ipi != 0) {
            $unit_price_with_ipi -= $product->coupon_discount_unit_ipi;
        }
        if ($product->installment_discount_unit_ipi != 0) {
            $unit_price_with_ipi -= $product->installment_discount_unit_ipi;
        }

        return $unit_price_with_ipi;
    }

    public function getSubtotalWithIpi()
    {
        $product = $this;
        $subtotal_with_ipi = is_numeric($product->subtotal_with_ipi) ? $product->subtotal_with_ipi : stringToFloat($product->subtotal_with_ipi);
        if ($product->coupon_discount_value_ipi != 0) {
            $subtotal_with_ipi -= $product->coupon_discount_value_ipi;
        }
        if ($product->installment_discount_value_ipi != 0) {
            $subtotal_with_ipi -= $product->installment_discount_value_ipi;
        }

        return $subtotal_with_ipi;
    }

    public function calculateDiscountSum()
    {
        $product = $this;

        $discount = is_numeric($product->discount) ? $product->discount : stringToFloat($product->discount);
        if ($product->coupon_discount_value != 0) {
            $discount += $product->coupon_discount_value;
        }
        if ($product->installment_discount_value != 0) {
            $discount += $product->installment_discount_value;
        }

        return $discount;
    }
}
