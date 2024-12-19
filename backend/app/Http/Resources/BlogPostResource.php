<?php

namespace App\Http\Resources;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $embedType = null;
        $embed = null;
        if (!empty($this->embed_type)) {
            $embed = $this->embed_type == BlogPost::class ? $this->post : $this->product;
            $embedType = $this->embed_type == BlogPost::class ? 'Postagem' : 'Produto';
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'searcheable' => $this->searcheable,
            'published_at' => $this->published_at,
            'featured_until' => $this->featured_until,
            'use_video' => $this->use_video,
            'youtube_link' => $this->youtube_link,
            'primary_text' => $this->getRawOriginal('primary_text'),
            'secondary_text' => $this->getRawOriginal('secondary_text'),
            'embed_type' => $embedType,
            'embed_id' => $this->embed_id,
            'embed_title' => $embed?->title,
            'seo_title' => $this->seo_title,
            'seo_tags' => $this->seo_tags,
            'seo_description' => $this->seo_description,
            'url' => $this->route?->url,
            'full_url' => $this->route ? url($this->route->url) : null,
            'main_image' => new GalleryImageResource($this->images?->where('main', 1)->first()),
            'images' => GalleryImageResource::collection($this->images?->where('main', 0)),
            'files' => FileResource::collection($this->whenLoaded('files')),
            'author' => new BlogAuthorResource($this->whenLoaded('author')),
            'category' => new BlogCategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
