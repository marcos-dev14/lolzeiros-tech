<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierInstallmentRuleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "mixed",
        'name' => "mixed",
        'min_value' => "mixed",
        'installments' => "mixed",
        'discount_value' => "mixed",
        'additional_value' => "mixed",
        'client' => "mixed",
        'client_group' => "mixed"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'min_value' => $this->min_value,
            'installments' => $this->installments,
            'discount_value' => $this->discount_value,
            'additional_value' => $this->additional_value,
            'client' => $this->client->name ?? null,
            'client_group' => $this->clientGroup->name ?? null
        ];
    }
}
