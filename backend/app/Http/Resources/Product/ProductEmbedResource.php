<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\GalleryImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ProductEmbedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'title' => "string",
        'reference' => "string",
        'category' => "\App\Http\Resources\Product\CategoryResource",
        'brand' => "\App\Http\Resources\Product\BrandResource",
        'badge' => "\App\Http\Resources\Product\BadgeResource",
        'embed' => "\App\Http\Resources\Product\ProductEmbedResource",
        'supplier' => "\App\Http\Resources\Product\SupplierEmbedResource",
        'unit_price' => "string",
        'unit_price_promotional' => "string",
        'unit_minimal' => "integer",
        'unit_subtotal' => "string",
        'box_price' => "string",
        'box_price_promotional' => "string",
        'box_minimal' => "integer",
        'box_subtotal' => "string",
        'availability' => "string",
        'images' => "\App\Http\Resources\GalleryImageResource"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'reference' => $this->reference,
            'unit_price' => $this->unit_price,
			'unit_price_promotional' => $this->unit_price_promotional,
			'unit_minimal' => $this->unit_minimal,
			'unit_subtotal' => $this->unit_subtotal,
            'box_price' => $this->box_price,
			'box_price_promotional' => $this->box_price_promotional,
			'box_minimal' => $this->box_minimal,
			'box_subtotal' => $this->box_subtotal,
            'availability' => $this->availability,
            'category' => new CategoryResource($this->category),
            'brand' => new BrandResource($this->brand),
            'badge' => new BadgeResource($this->badge),
            'supplier' => new SupplierResource($this->supplier),
            'images' => GalleryImageResource::collection($this->images),
            //'attribute_category_id' => (new AttributeCategoryResource()->whenLoaded('attribute_category'))
        ];
    }
}
