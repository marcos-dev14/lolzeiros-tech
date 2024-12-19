<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Invoice;
use App\Models\InvoiceBillet;
use App\Models\OrderStatus;
use Carbon\Carbon;

class OrderObserver
{
    public function created(Order $order)
    {
        OrderStatus::create([
            'name' => 'new',
            'order_id' => $order->id
        ]);

        $order->update([
            //'origin' => 'Website',
            'code' => $order->getNewCode()
        ]);

        $this->processInvoice($order);
    }

    protected function processInvoice(Order $order): void
    {
        $supplier = $order->supplier;
        $client = $order->client;
        $clientProfile = $client->profile;
        $status = $order->orderStatuses()->first();
        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $supplierCommisions = $supplier->commissionRules;
        $payment = false;
        foreach ($supplierCommisions as $supplierCommision) {
            if ($supplierCommision->id == 2) {
                $payment = true;
            }
        }
        $augeCommission = ($supplierDiscount?->auge_commission / 100) * $order->total_value;
        $commercialCommission = ($supplierDiscount?->commercial_commission / 100) * $order->total_value;
        $installmentRules = explode('/', $order->installment_rule);
        $countInstallment = count($installmentRules);
        $billetsValuePercentage = $order->total_value / $countInstallment;
        $augeBilletsCommission = ($supplierDiscount?->auge_commission / 100) * $billetsValuePercentage;
        $commercialBilletsCommission = ($supplierDiscount?->commercial_commission / 100) * $billetsValuePercentage;
        if ($payment === true) {
            $invoices = Invoice::create([
                'order_id' => $order->id,
                'number' => $order->code,
                'value' => $order->total_value,
                'term_payment' => $order->installment_rule,
                'term_qty' => $countInstallment,
                'commission' => $augeCommission ?? 0,
                'percentage_commission' => $supplierDiscount?->auge_commission ?? 0,
                'commercial_commission' => $commercialCommission ?? 0,
                'commercial_percentage' => $supplierDiscount?->commercial_commission ?? 0,
                'order_status_id' => $status->id,
                'status' => 2,
            ]);

           /*  $user = auth()->user();
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);

            $order->current_status = 'billed';
            $order->update(); */
        } else {
            $invoices = Invoice::create([
                'order_id' => $order->id,
                'number' => $order->code,
                'value' => $order->total_value,
                'term_payment' => $order->installment_rule,
                'term_qty' => $countInstallment,
                'commission' => $augeCommission ?? 0,
                'percentage_commission' => $supplierDiscount?->auge_commission ?? 0,
                'commercial_commission' => $commercialCommission ?? 0,
                'commercial_percentage' => $supplierDiscount?->commercial_commission ?? 0,
                'order_status_id' => $status->id,
            ]);
        }
        //$order->invoiced_value = $order->invoiced_value + $order->total_value;
        //$order->update();

        $startDate = now();
        if ($countInstallment > 0) {
            for ($i = 0; $i < $countInstallment; $i++) {
                $dueDate = $startDate->addDays(30);
                if ($payment === true) {
                    $augeDate = now()->addMonth(1);
                    $commercialDate = now()->addMonth(2);
                } else {
                    $augeDate = Carbon::parse($dueDate)->addMonth(1);
                    $commercialDate = Carbon::parse($dueDate)->addMonth(2);
                }
                $count = $i;

                $invoiceBilletData = [
                    'number' => $order->code . '-' . $count,
                    'invoice_id' => $invoices->id,
                    'due_date' => $dueDate,
                    'value' => $order->total_value / $countInstallment,
                    'commission' => $augeBilletsCommission ?? 0,
                    'percentage_commission' => $supplierDiscount?->auge_commission ?? 0,
                    'commercial_commission' => $commercialBilletsCommission ?? 0,
                    'commercial_percentage' => $supplierDiscount?->commercial_commission ?? 0,
                    'invoice_billet_status_id' => 1,
                    'paid_commission' => $augeDate,
                    'paid_commercial' => $commercialDate,
                    'title_bearer' => 'Fornecedor',
                ];

                if ($payment === true) {
                    $invoiceBilletData['paid_at'] = now();
                }

                InvoiceBillet::create($invoiceBilletData);
            }
        }
    }
}
