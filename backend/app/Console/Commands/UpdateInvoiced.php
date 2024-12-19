<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class UpdateInvoiced extends Command
{
    protected $signature = 'update:invoiced';
    protected $description = 'Update invoiced orders solution for bug sub value';

    public function handle()
    {
        $this->info('Fetching Orders...');
        $orders = Order::with('invoices.invoiceBillets')->get();

        $this->info('Updating Invoiced Value...');
        foreach ($orders as $order) {
            $sum = $order->invoices->sum('value');
            if ($sum) {
                $oldValue = $order->invoiced_value;
                $order->update(['invoiced_value' => $sum]);
                $this->info("Order ID: {$order->id} - OK! Old value = {$oldValue}, New value = {$sum}");
            }

            if ($order->invoices->count() > 0) {
                $this->info('Updating Invoice Numbers...');
                foreach ($order->invoices as $invoice) {
                    foreach ($invoice->invoiceBillets as $key => $billet) {
                        $number = $invoice->number ? $invoice->number . ' - ' . ($key + 1) : $order->code . ' - ' . ($key + 1);
                        $oldNumber = $billet->number;
                        $billet->update(['number' => $number]);
                        $this->info("Invoice ID: {$invoice->id} - OK! Old value = {$oldNumber}, New value = {$number}");
                    }
                }
            }
        }

        $this->info('Completed');
    }
}
