<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\FileResource;
use App\Http\Resources\GalleryImageResource;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $this->resource->load('route');

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
            'reference' => $this->reference,
            'availability' => $this->availability,
            'api_reference' => $this->api_reference,
            'searcheable' => $this->searcheable,
            'published_at' => $this->published_at?->toIso8601String(),
            'featured_until' => $this->featured_until?->toIso8601String(),
            'use_video' => $this->use_video,
            'youtube_link' => $this->youtube_link,
            'primary_text' => $this->getRawOriginal('primary_text'),
            'secondary_text' => $this->getRawOriginal('secondary_text'),
            'embed_type' => $embedType,
            'embed_id' => $this->embed_id,
            'embed_title' => $embed?->title,
            'inner_code' => $this->inner_code,
            'ean13' => $this->ean13,
            'display_code' => $this->display_code,
            'dun14' => $this->dun14,
            'expiration_date' => $this->expiration_date,
            'origin' => $this->origin,
            'release_year' => $this->release_year,
            'catalog_name' => $this->catalog_name,
            'catalog_page' => $this->catalog_page,
            'gender' => $this->gender,
            'size_height' => $this->size_height,
            'size_width' => $this->size_width,
            'size_length' => $this->size_length,
            'size_cubic' => !empty($this->size_cubic) ? ($this->size_cubic / 1000000) : $this->size_cubic,
            'size_weight' => $this->size_weight,
            'packing_type' => $this->packing_type,
            'box_height' => $this->box_height,
            'box_width' => $this->box_width,
            'box_length' => $this->box_length,
            'box_cubic' => !empty($this->box_cubic) ? ($this->box_cubic / 1000000) : $this->box_cubic,
            'box_weight' => $this->box_weight,
            'box_packing_type' => $this->box_packing_type,
            'unit_price' => $this->unit_price,
            'unit_price_promotional' => $this->unit_price_promotional,
            'unit_minimal' => $this->unit_minimal,
            'unit_subtotal' => $this->unit_subtotal,
            'expected_arrival' => $this->expected_arrival,
            'box_price' => $this->box_price,
            'box_price_promotional' => $this->box_price_promotional,
            'box_minimal' => $this->box_minimal,
            'box_subtotal' => $this->box_subtotal,
            'ipi' => $this->ipi,
            'ncm' => $this->ncm,
            'cst' => $this->cst,
            'cfop' => $this->cfop,
            'icms' => $this->icms,
            'certification' => $this->certification,
            'age_group' => $this->age_group,
            'seo_title' => $this->seo_title,
            'seo_tags' => $this->seo_tags,
            'seo_description' => $this->seo_description,
            'enable_fractional_box' => $this->supplier?->fractional_box,
            'qrcode_color' => $this->qrcode_color,
            'qrcode_custom_title' => $this->qrcode_custom_title,
            'qrcode_title' => $this->qrcode_title,
            'qrcode_image1' => $this->qrcode_image1,
            'qrcode_image2' => $this->qrcode_image2,
            'views' => $this->views,
            'sales' => $this->sales,
            'packaging' => $this->packaging ?? null,
            'url' => $this->route?->url,
            'full_url' => $this->route ? url($this->route->url) : null,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'badge' => new BadgeResource($this->whenLoaded('badge')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'related' =>  ProductRelatedResource::collection($this->whenLoaded('related')),
            'variations' => ProductVariationResource::collection($this->whenLoaded('variations')),
            'main_image' => new GalleryImageResource($this->images?->where('main', 1)->first()),
            'images' => GalleryImageResource::collection($this->images?->where('main', 0)),
            'files' => FileResource::collection($this->whenLoaded('files')),
            'attribute_category' => new AttributeCategoryResource($this->attributeCategory),
            'attributes' => ProductAttributeResource::collection($this->pAttributes),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
