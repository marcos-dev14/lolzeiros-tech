<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierPromotionResource extends JsonResource
{
    #[ArrayShape([
        'id' => "integer",
        'discount_value' => "double",
        'min_quantity' => "integer",
        'valid_until' => "string",
        'type' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'discount_value' => $this->discount_value,
            'min_quantity' => $this->min_quantity,
            'valid_until' => $this->valid_until,
            'type' => $this->type,

            $this->mergeWhen($this->type == (new ($this->resource::class))::BY_CATEGORY, [
              'categories' => JustNameResource::collection($this->whenLoaded('categories'))
            ]),

            $this->mergeWhen($this->type == (new ($this->resource::class))::BY_PRODUCT, [
              'products' => SupplierPromotionProductResource::collection($this->whenLoaded('products'))
            ]),
        ];
    }
}
