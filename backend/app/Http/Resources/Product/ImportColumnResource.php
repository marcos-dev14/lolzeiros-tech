<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ImportColumnResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'field_name' => "string",
        'field_label' => "string",
        'column' => "string"
    ])]
    public function toArray($request): array
    {
        $columns = $this->resource::AVAILABLE_COLUMNS;

        return [
            'id' => $this->id,
            'field_name' => $this->field_name,
            'field_label' => $columns[$this->field_name],
            'column' => $this->column
        ];
    }
}
