<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BlogCategoryResource extends JsonResource
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
        'slug' => "string",
        'parent_id' => "integer",
        'depth' => "integer",
        'slug_path' => "string",
        "posts_count" => 'integer',
        "categories" => 'mixed'
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'parent_id' => $this->parent_id,
            'depth' => $this->depth,
            'slug_path' => $this->slug_path,
            'posts_count' => $this->recursive_posts_count,
            'categories' => BlogCategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}
