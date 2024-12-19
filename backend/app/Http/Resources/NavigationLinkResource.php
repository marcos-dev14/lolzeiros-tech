<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class NavigationLinkResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'label' => "string",
        'order' => "integer",
        'type' => "string",
        'linkable_id' => "string",
        'url' => "string",
        'full_url' => "string",
        'created_at' => "string",
        'updated_at' => "string",
    ])]
    public function toArray($request): array
    {
        $url = $this->url;
        $fullUrl = url($url);

        $types = array_flip($this->resource->types);
        $type = $types[$this->linkable_type ?? 'external'];

        return [
            'id' => $this->id,
            'label' => $this->label,
            'order' => $this->order,
            'type' => $type,
            'linkable_id' => $this->linkable_id,
            'url' => $url,
            'full_url' => $fullUrl,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
