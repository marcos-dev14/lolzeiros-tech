<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BannerImageResource extends JsonResource
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
        'order' => "integer",
        'link' => "integer",
        'imageping' => "integer",
        'url' => "string"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'label' => $this->label,
            'order' => $this->order,
            'link' => $this->link,
            'imageping' => $this->imageping,
            'url' => $this->image
        ];
    }
}
