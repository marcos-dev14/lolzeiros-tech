<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;

class OrderFrontExport implements FromCollection
{
    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function collection()
    {
        $products = $this->order->products;

        $data = [];

        $data[] = ['INFORMAÇÕES DO PEDIDO'];

        $header = [
            'Numero do Pedido',
            'Data',
            'Cliente',
            'CNPJ',
            'Total',
        ];

        if ($this->order->calculateDiscountSumOrder() != 0) {
            $header[] = 'Desconto';
        }

        if ($this->order->coupon) {
            $header[] = 'Cupom';
        }

        $data[] = $header;

        $orderInfo = [
            $this->order->code,
            $this->order->created_at->format('d/m/Y'),
            $this->order->client->company_name ?? $this->order->client->name,
            $this->order->client->document,
            $this->order->getTotalValueWithIpi(),
        ];

        if ($this->order->calculateDiscountSumOrder() != 0) {
            $orderInfo[] = $this->order->calculateDiscountSumOrder();
        }

        if ($this->order->coupon) {
            $orderInfo[] = $this->order->coupon->name;
        }

        $data[] = $orderInfo;

        $data[] = [];

        $data[] = [
            'ITEM',
            'REFERÊNCIA',
            'QUANTIDADE',
            'PREÇO LIQUIDO',
            'PREÇO C/ IPI',
            'SUBTOTAL',
            'ECONOMIA'
        ];

        foreach ($products as $product) {
            $row = [
                $product->title,
                $product->reference,
                $product->qty,
                $product->getUnitPrice(),
                $product->getUnitPriceWithIpi(),
                $product->getSubtotalWithIpi(),
            ];

            if($product->calculateDiscountSum() != 0){
                $row[] = $product->calculateDiscountSum();
            }

            $data[] = $row;
        }

        return new Collection($data);
    }
}

