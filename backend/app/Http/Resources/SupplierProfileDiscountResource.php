<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierProfileDiscountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        if ($this->type == 'state_discount') {
            return [
                'id' => $this->id,
                'discount_value' => $this->discount_value,
                'additional_value' => $this->additional_value,
                'states' => CountryStateResource::collection($this->states)
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'min_value' => $this->min_value,
            'installments' => $this->installments,
            'installment_discount_value' => $this->installment_discount_value,
            'installment_additional_value' => $this->installment_additional_value,
            'in_cash' => $this->in_cash,
            'in_cash_discount_value' => $this->in_cash_discount_value,
            'in_cash_additional_value' => $this->in_cash_additional_value,
            'client' => $this->client->name ?? null,
            'client_group' => $this->clientGroup->name ?? null
        ];
    }
}
