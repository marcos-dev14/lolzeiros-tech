<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'zipcode' => "string",
        'street' => "string",
        'number' => "string|null",
        'complement' => "string|null",
        'district' => "string|null",
        'full_address' => "string|null",
        'state' => "mixed",
        'city' => "mixed",
        'type' => "mixed",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'zipcode' => $this->zipcode,
            'street' => $this->street,
            'number' => $this->number,
            'complement' => $this->complement,
            'district' => $this->district,
            'full_address' => $this->full_address,
            'state' => new CountryStateResource($this->whenLoaded('state')),
            'city' => new CountryCityResource($this->whenLoaded('city')),
            'type' => new JustNameResource($this->whenLoaded('type'))
        ];
    }
}
