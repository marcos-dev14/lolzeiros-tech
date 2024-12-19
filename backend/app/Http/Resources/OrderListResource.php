<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $clientName = !empty($this->client?->company_name) ? $this->client?->company_name : $this->client?->name;

        return [
            'code' => $this->code,
            'client_name' => $clientName,
            'supplier_name' => $this->product_supplier_name,
            'address_city' => "$this->address_city - {$this->addressState?->code}",
            'date' => $this->created_at?->toIso8601String(),
            'formated_date' => $this->created_at?->format('d/m/Y H:i'),
            'total_value' => $this->total_value,
            'current_status' => $this->current_status
        ];
    }
}
