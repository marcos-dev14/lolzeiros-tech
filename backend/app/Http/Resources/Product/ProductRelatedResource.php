<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\GalleryImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ProductRelatedResource extends JsonResource
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
        'unit_price' => "string",
        'unit_price_promotional' => "string",
        'unit_minimal' => "integer",
        'unit_subtotal' => "string",
        'box_price' => "string",
        'box_price_promotional' => "string",
        'box_minimal' => "integer",
        'box_subtotal' => "string",
        'availability' => "string",
        'created_at' => "string",
        'updated_at' => "string",
        'brand' => "\App\Http\Resources\Product\BrandResource",
        'badge' => "\App\Http\Resources\Product\BadgeResource",
        'supplier' => "\App\Http\Resources\Product\SupplierEmbedResource",
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'brand' => new BrandResource($this->brand),
            'badge' => new BadgeResource($this->badge),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'images' => (!empty($this->images) && count($this->images))
                ? GalleryImageResource::collection([$this->images->first()])
                : null,
        ];
    }
}
