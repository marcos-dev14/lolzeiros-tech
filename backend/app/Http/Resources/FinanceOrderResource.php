<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class FinanceOrderResource extends JsonResource
{
    public function toArray($request): array
    {
        $order = $this;

        $status = $order->current_status;
        $invoices = $order->invoice;
        $clientName = !empty($order->client?->company_name) ? $order->client?->company_name : $order->client?->name;

        return [
            'id' => $order->id,
            'code' => $order->code,
            'created' => $order->created_at,
            'value' => $order->total_value,
            'client' => $clientName,
            'cnpj' => $order->client->document ?? 'não informado!',
            'suppler' => $order->product_supplier_name,
            'external_order_id' => $order->external_order_id,
            'status' => $status,
            'invoice' => $invoices
        ];
    }
}
