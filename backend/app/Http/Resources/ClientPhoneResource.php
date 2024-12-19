<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ClientPhoneResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'type' => "string",
        'country_code' => "string",
        'number' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'country_code' => $this->country_code,
            'number' => $this->number,
        ];
    }
}
