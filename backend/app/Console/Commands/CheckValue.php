<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class CheckValue extends Command
{
    protected $signature = 'check:value';
    protected $description = 'Invoiced orders value without canceled orders and monthly average';

    public function handle()
    {
        $this->info('Fetching Orders from the last 3 months...');
        // Data de 3 meses atrás
        $threeMonthsAgo = now()->subMonths(3);

        // Obtém pedidos dos últimos três meses, excluindo os com current_status "cancelado"
        $orders = Order::with('invoices.invoiceBillets')
            ->where('created_at', '>=', $threeMonthsAgo)
            ->where('current_status', '!=', 'cancelado')
            ->get();

        $totalOrderValue = 0;
        $totalInvoiceValue = 0;
        $totalAugePercentage = 0;
        $totalComercialPercentage = 0;
        $months = 3; // Definir o número de meses para o cálculo da média

        $this->info('Processing Invoiced Value...');
        foreach ($orders as $order) {
            // Somar o valor de todas as faturas do pedido
            $sum = $order->invoices->sum('value');
            if ($sum) {
                $oldValue = $order->invoiced_value;
                $this->info("Order ID: {$order->id} - OK! Old value = {$oldValue}, New value = {$sum}");
                $totalOrderValue += $sum; // Acumular o valor do pedido
            }

            if ($order->invoices->count() > 0) {
                $this->info('Processing Invoice Numbers...');
                foreach ($order->invoices as $invoice) {
                    // Verificar se invoice->number é diferente de order->code
                    if ($invoice->number !== $order->code) {
                        $totalInvoiceValue += $invoice->value; // Acumular o valor da fatura
                    }

                    foreach ($invoice->invoiceBillets as $key => $billet) {
                        $number = $invoice->number ? $invoice->number . ' - ' . ($key + 1) : $order->code . ' - ' . ($key + 1);
                        $oldNumber = $billet->number;
                        $this->info("Invoice ID: {$invoice->id} - OK! Old value = {$oldNumber}, New value = {$number}");
                    }

                    // Supondo que o valor da porcentagem da Auge seja calculado por alguma regra no invoice
                    if ($invoice->commission) {
                        $totalAugePercentage += $invoice->commission; // Acumular porcentagem
                    }

                    if ($invoice->commercial_commission) {
                        $totalComercialPercentage += $invoice->commercial_commission; // Acumular porcentagem
                    }
                }
            }
        }

        // Cálculo da média mensal
        $averageOrderValue = $totalOrderValue / $months;
        $averageInvoiceValue = $totalInvoiceValue / $months;
        $averageAugePercentage = $totalAugePercentage / $months;
        $averageComercialPercentage = $totalComercialPercentage / $months;

        $this->info('Completed');
        $this->info("Total Order Value in last 3 months: {$totalOrderValue}");
        $this->info("Total Invoice Value (where invoice->number != order->code): {$totalInvoiceValue}");
        $this->info("Total Auge Percentage Value: {$totalAugePercentage}");
        $this->info("Total Comercial Percentage Value: {$totalComercialPercentage}");

        // Exibir as médias mensais
        $this->info("Monthly Average Order Value: {$averageOrderValue}");
        $this->info("Monthly Average Invoice Value (where invoice->number != order->code): {$averageInvoiceValue}");
        $this->info("Monthly Average Auge Percentage Value: {$averageAugePercentage}");
        $this->info("Monthly Average Comercial Percentage Value: {$averageComercialPercentage}");
    }
}
