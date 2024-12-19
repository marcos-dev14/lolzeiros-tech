<?php

namespace App\Observers;

use App\Models\Invoice;

class InvoiceObserver
{
    public function created(Invoice $invoice): void
    {
        $order = $this->getOrder($invoice);

        $this->updateOrder(
            $invoice,
            ['invoiced_value' => $order->invoiced_value + $invoice->value]
        );
    }

    public function deleted(Invoice $invoice): void
    {
        $order = $this->getOrder($invoice);

        $this->updateOrder(
            $invoice,
            ['invoiced_value' => $order->invoiced_value - $invoice->value]
        );
    }

    protected function updateOrder(Invoice $invoice, array $data): void
    {
        $order = $this->getOrder($invoice);

        $order->fill($data);

        $order->save();
    }

    protected function getOrder(Invoice $invoice)
    {
        $invoice->loadMissing('order');

        return $invoice->order;
    }
}
