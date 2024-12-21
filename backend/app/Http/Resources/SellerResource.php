<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SellerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape(['id' => "mixed", 'name' => "mixed", 'phone' => "mixed", 'email' => "mixed"])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'avaliable_opportunity' => $this->avaliable_opportunity,
            'receive_inactive_customers' => $this->receive_inactive_customers,
            'origin' => $this->origin,
            'portfolio_customer' => $this->portfolio_customer,
            'phone' => $this->phone,
            'cellphone' => $this->cellphone,
            'email' => $this->email,
            'blocked_suppliers' => $this->blockedSuppliers->map(function ($blockedSupplier) {
                return $blockedSupplier->supplier; // Retorna apenas os dados do fornecedor
            }),
            'created_at' => $this->created_at,
        ];
    }
}
