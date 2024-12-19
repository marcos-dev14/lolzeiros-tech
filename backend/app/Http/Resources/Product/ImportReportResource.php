<?php

namespace App\Http\Resources\Product;

use App\Models\ImportColumns;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ImportReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'line' => "string",
        'column_reference' => "string",
        'column_name' => "string",
        'product_reference' => "mixed|null",
        'status' => "string",
        'message' => "string"
    ])]
    public function toArray($request): array
    {
        if ($this->column_name !== 'Todos') {
            $columnName = (new ImportColumns)::AVAILABLE_COLUMNS[$this->column_name];
        }

        return [
            'line' => $this->line,
            'column_reference' => $this->column_reference,
            'column_name' => $columnName ?? $this->column_name,
            'product_reference' => $this->product_reference ?? null,
            'status' => $this->status,
            'message' => $this->message,
        ];
    }
}
