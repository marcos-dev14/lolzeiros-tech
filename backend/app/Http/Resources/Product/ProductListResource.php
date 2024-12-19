<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\GalleryImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'reference' => $this->reference,
            'availability' => $this->availability,
            'ean13' => $this->ean13,
            'dun14' => $this->dun14,
            'box_price' => $this->box_price,
            'box_price_promotional' => $this->box_price_promotional,
            'box_minimal' => $this->box_minimal,
            'views' => $this->views,
            'sales' => $this->sales,
            'origin' => $this->origin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => GalleryImageResource::collection($this->whenLoaded('images')),
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
        ];
    }
}
