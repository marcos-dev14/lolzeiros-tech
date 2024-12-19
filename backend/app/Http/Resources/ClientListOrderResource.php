<?php

namespace App\Http\Resources;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientListOrderResource extends JsonResource
{
    public function toArray($request): array
    {
        $order = $this->resource;
        $order->loadMissing('seller');

        if (!$order instanceof Order) {
            return [];
        }

        return [
            'created_at' => $order->created_at?->toIso8601String(),
            'formated_date_time' => $this->getFormatedDateTime($order->created_at),
            'seller_name' => $order->seller?->name,
            'supplier_name' => $order->product_supplier_name,
            'count_products' => $order->count_sum_products,
            'total_value' => $order->total_value,
            'total_value_with_ipi' => $order->total_value_with_ipi,
        ];
    }

    protected function getFormatedDateTime(Carbon $dateTime): string
    {
        return $dateTime->format('d/m/Y H:i') . 'h (' . $dateTime->diffForHumans() . ')';
    }
}
