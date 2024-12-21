<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierListResource extends JsonResource
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
        'image' => "array",
        'is_available' => "boolean",
        'categories_count' => "integer",
        'products_count' => "integer",
        'products_available_count' => "integer",
        'last_imported_at' => "string",
        'created_at' => "string",
        'updated_at' => "string",
        'categories' => "\Illuminate\Http\Resources\Json\AnonymousResourceCollection",
    ])]
    public function toArray($request): array
    {
        $response = [
            'id' => $this->id,
            'name' => $this->name,
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'service_migrate' => $this->service_migrate,
            'is_available' => (bool)$this->is_available,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'image' => [],
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
