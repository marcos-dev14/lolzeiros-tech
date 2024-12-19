<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class GalleryImageResource extends JsonResource
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
        'label' => "string",
        'dimensions' => "string",
        'order' => "integer",
        'main' => "bool",
        'image' => "array",
        'thumb' => "array",
    ])]
    public function toArray($request): array
    {
        $image = asset($this->image);
        $thumb = asset($this->thumb);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'label' => $this->label,
            'dimensions' => $this->dimensions,
            'order' => $this->order,
            'main' => (bool) $this->main,
            'image' => [
                'JPG' => $image,
                'WEBP' => str_replace('jpg', 'webp', $image)
            ],
            'thumb' => [
                'JPG' => $thumb,
                'WEBP' => str_replace('jpg', 'webp', $thumb)
            ]
        ];
    }
}
