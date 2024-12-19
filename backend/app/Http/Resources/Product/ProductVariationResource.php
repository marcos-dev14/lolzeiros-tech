<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\GalleryImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ProductVariationResource extends JsonResource
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
        'ean13' => "string",
        'dun14' => "string",
        'images' => "\App\Http\Resources\GalleryImageResource"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'reference' => $this->reference,
			'ean13' => $this->ean13,
			'dun14' => $this->dun14,
            'images' => new GalleryImageResource($this->images->first()),
        ];
    }
}
