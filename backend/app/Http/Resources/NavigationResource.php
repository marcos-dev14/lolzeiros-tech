<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class NavigationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'location' => "string",
        'title' => "string",
        'order' => "integer",
        'links' => "mixed",
        'created_at' => "string",
        'updated_at' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'location' => $this->location,
            'title' => $this->title,
            'order' => $this->order,
            'links' => NavigationLinkResource::collection($this->whenLoaded('links')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
