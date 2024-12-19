<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use JetBrains\PhpStorm\Pure;

class ShippingCompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[Pure]
    #[ArrayShape([
        'id' => "integer",
        'company_name' => "string",
        'name' => "string",
        'document' => "string|null",
        'phone' => "string|null",
        'cellphone' => "string|null",
        'whatsapp' => "string|null",
        'email' => "string|null",
        'country_state_id' => "integer|null",
        'country_state_name' => "string|null",
        'country_state' => "mixed|null",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'name' => $this->name,
            'document' => $this->document,
            'phone' => $this->phone,
            'cellphone' => $this->cellphone,
            'whatsapp' => $this->whatsapp,
            'email' => $this->email,
            'country_state_id' => $this->country_state_id,
            'country_state_name' => $this?->countryState?->name,
            'country_state' => new CountryStateResource($this->countryState)
        ];
    }
}
