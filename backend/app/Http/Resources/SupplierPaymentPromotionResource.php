<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierPaymentPromotionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'order_deadline' => "string",
        'min_value' => "string",
        'payment_term_start' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_deadline' => $this->order_deadline,
            'min_value' => number_format($this->getRawOriginal('min_value'), 2),
            'payment_term_start' => $this->payment_term_start,
        ];
    }
}
