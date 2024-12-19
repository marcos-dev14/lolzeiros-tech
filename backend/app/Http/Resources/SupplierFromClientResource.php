<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierFromClientResource extends JsonResource
{
    #[ArrayShape([
        'id' => "integer",
        'name' => "string",
        'profile_discount' => "string",
        'commercial_commission' => "string",
        'is_available' => "boolean",
        'icms' => "float",
        'fractional_box' => "boolean",
        'last_order' => "string"
    ])]
    public function toArray($request): array
    {
        return [
            'name' => $this['name'],
            'profile_discount' => $this['profile_discount'],
            'commercial_commission' => $this['commercial_commission'],
            'is_available' => $this['is_available'],
            'icms' => $this['icms'],
            'fractional_box' => $this['fractional_box'],
            'last_order' => $this['last_order'],
        ];
    }
}
