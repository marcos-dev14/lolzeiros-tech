<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class AttributeCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'name' => "string",
        "products_count" => 'integer',
        'attributes' => "App\\Http\\Resources\\Product\\AttributeResource"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'products_count' => $this->products->count(),
            'attributes' => AttributeResource::collection($this->whenLoaded('attributes'))
        ];
    }
}
