<?php

namespace App\Models;

use App\Casts\Money;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CartInstanceProduct extends Model
{
    const IMAGEABLE_PATH = 'products/gallery/{id}';

    protected $fillable = [
        'reference',
        'title',
        'image',
        'qty',
        'ipi',
        'ipi_value',
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
        'discount_percentage',
        'fractionated',
        'product_id',
        'cart_instance_id',
        'availability'
    ];

    public $casts = [
        'unit_price' => Money::class,
        'unit_price_with_ipi' => Money::class,
        'original_price' => Money::class,
        'discount' => Money::class,
        'subtotal' => Money::class,
        'subtotal_with_ipi' => Money::class,
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function instance(): BelongsTo
    {
        return $this->belongsTo(CartInstance::class, 'cart_instance_id');
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
        return (str_contains('default', $this->thumb))
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
}
