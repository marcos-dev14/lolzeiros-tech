<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class OrderStatusResource extends JsonResource
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
        'user' => "string",
        'date' => "string",
        'formated_date' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'user' => $this->user_name ?? 'Sem Informação',
            'date' => $this->created_at->toIso8601String(),
            'formated_date' => $this->created_at->format('d/m/Y H:i'),
        ];
    }
}
