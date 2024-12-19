<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierPromotionProductResource extends JsonResource
{
    #[ArrayShape([
        'id' => "integer",
        'name' => "string"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->title,
        ];
    }
}
