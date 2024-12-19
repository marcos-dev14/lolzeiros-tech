<?php

namespace App\Http\Resources\Product;

use App\Enums\Product\ImportReportStatusType;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ImportResource extends JsonResource
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
        'products_count' => "int",
        'errors' => "int",
        'initial_line' => "string",
        'new_register' => "boolean",
        'created_at' => "string",
        'updated_at' => "string",
        //'user' => "\App\Http\Resources\UserResource",
        'supplier' => "\App\Http\Resources\Product\SupplierResource",
        'columns' => "\Illuminate\Http\Resources\Json\AnonymousResourceCollection",
        'reports' => "\Illuminate\Http\Resources\Json\AnonymousResourceCollection",
    ])]
    public function toArray($request): array
    {
        $errorsCount = $this->reports()->where('status', ImportReportStatusType::ERROR)->count();
        $productsCount = $this->reports()->where('status', ImportReportStatusType::SUCCESS)->count();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'products_count' => $productsCount,
            'errors' => $errorsCount,
            'initial_line' => $this->initial_line,
            'new_register' => $this->new_register,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            //'user' => new UserResource($this->whenLoaded('user')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'columns' => ImportColumnResource::collection($this->whenLoaded('columns')),
            'reports' => ImportReportResource::collection($this->reports),
        ];
    }
}
