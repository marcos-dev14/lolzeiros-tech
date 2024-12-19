<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BannerBlockResource
    extends JsonResource
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
        'desktop_images_count' => "string",
        'mobile_images_count' => "string",
        'desktop_images' => "string",
        'mobile_images' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'desktop_images_count' => $this->desktop_images_count,
            'mobile_images_count' => $this->mobile_images_count,
            'desktop_images' => BannerImageResource::collection($this->whenLoaded('desktopImages')),
            'mobile_images' => BannerImageResource::collection($this->whenLoaded('mobileImages')),
        ];
    }
}
