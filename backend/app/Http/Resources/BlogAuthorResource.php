<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BlogAuthorResource extends JsonResource
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
        'resume' => "string",
        'email' => "string",
        'instagram' => "string",
        'facebook' => "string",
        'youtube' => "string",
        'twitter' => "string",
        'biography' => "string",
        'use_card_on_post' => "boolean",
        'card_color' => "string",
        'image' => "array",
    ])]
    public function toArray($request): array
    {
        $response = [
            'id' => $this->id,
            'name' => $this->name,
            $this->mergeWhen(!$request->routeIs('api.blog.authors.index'), [
                'resume' => $this->resume,
                'twitter' => $this->twitter,
                'biography' => $this->biography,
                'use_card_on_post' => (bool)$this->use_card_on_post,
                'card_color' => $this->card_color,
            ]),
            'email' => $this->email,
            'instagram' => $this->instagram,
            'facebook' => $this->facebook,
            'youtube' => $this->youtube,
            'image' => [],
        ];

        if (
            !$request->routeIs('api.blog.authors.index')
            && $this->image
            && $this->image_path
        ) {
            $image = asset("$this->image_path/$this->image");
            $response['image'] = [
                'JPG' => $image,
                'WEBP' => str_replace('jpg', 'webp', $image)
            ];
        }

        return $response;
    }
}
