<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BadgeResource extends JsonResource
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
        'image' => "array"
    ])]
    public function toArray($request): array
    {
        $response = [
            'id' => $this->id,
            'name' => $this->name,
            'image' => []
        ];

        if ($this->image && $this->image_path) {
            $image = asset("$this->image_path/$this->image");
            $response['image'] = [
                'JPG' => $image,
                'WEBP' => str_replace('jpg', 'webp', $image)
            ];
        }

        return $response;
    }
}