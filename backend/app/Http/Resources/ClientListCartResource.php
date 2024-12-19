<?php

namespace App\Http\Resources;

use App\Models\Cart;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientListCartResource extends JsonResource
{
    public function toArray($request): array
    {
        $cart = $this->resource;

        if (! $cart instanceof Cart) {
            return [];
        }

        $cart->loadMissing('products');
        $cart->loadSum('products', 'qty');
        $cart->loadSum('products', 'subtotal_with_ipi');

        return [
            'created_at' => $this->getFormatedDateTime($cart->created_at),
            'last_update' => $this->getFormatedDateTime($cart->updated_at),
            'products_count' => $cart->products_sum_qty,
            'subtotal_with_ipi' => $cart->products_sum_subtotal_with_ipi,
            'instances' => $this->instances->map(function ($instance) {
                $instance->load('supplier');
                $instance->loadSum('products', 'qty');
                $instance->loadSum('products', 'subtotal_with_ipi');

                return [
                    'supplier' => $instance->supplier?->company_name ?? $instance->supplier?->name,
                    'created_at' => $this->getFormatedDateTime($instance->created_at),
                    'last_update' => $this->getFormatedDateTime($instance->updated_at),
                    'products_count' => $instance->products_sum_qty,
                    'subtotal_with_ipi' => $instance->products_sum_subtotal_with_ipi,
                ];
            }),
        ];
    }

    protected function getFormatedDateTime(Carbon $dateTime): string
    {
        return $dateTime->format('d/m/Y H:i').'h ('.$dateTime->diffForHumans().')';
    }
}
