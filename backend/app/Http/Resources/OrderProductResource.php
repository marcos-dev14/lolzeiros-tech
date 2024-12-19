<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable
    {

        return [
            'reference' => $this->reference,
            'title' => $this->title,
            'qty' => $this->qty,
            'unit_price' => doubleval($this->getRawOriginal('unit_price')),
            'original_price' => doubleval($this->getRawOriginal('original_price')),
            'subtotal' => doubleval($this->getRawOriginal('subtotal')),
            'discount' => $this->calculateDiscountSum(),
            'coupon_discount_unit' => doubleval($this->getRawOriginal('coupon_discount_unit')),
            'coupon_discount_unit_ipi' => doubleval($this->getRawOriginal('coupon_discount_unit_ipi')),
            'coupon_discount_value' => doubleval($this->getRawOriginal('coupon_discount_value')),
            'coupon_discount_value_ipi' => doubleval($this->getRawOriginal('coupon_discount_value_ipi')),
            'getUnitPrice' =>  $this->getUnitPrice(),
            'getUnitPriceWithIpi' =>  $this->getUnitPriceWithIpi(),
            'getSubtotalWithIpi' =>  $this->getSubtotalWithIpi(),
            'discount_percentage' => getDiffPercentage(
                doubleval($this->getRawOriginal('original_price')),
                $this->getUnitPrice()
            ),
            'fractionated' => (bool) $this->fractionated,
            'image' => [
                'JPG' => url($this->image),
                'WEBP' => url($this->webp_image)
            ],
            'thumb' => [
                'JPG' => url($this->thumb),
                'WEBP' => url($this->webp_thumb)
            ]
        ];
    }
}
