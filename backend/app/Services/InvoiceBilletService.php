<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceBillet;
use Carbon\Carbon;

class InvoiceBilletService extends BaseService
{
    public function __construct()
    {
        $this->model = new InvoiceBillet();
    }

    public function getMakeData(
        int $count,
        Invoice $invoice,
        Carbon $dueDate,
        ?float $commissionBaseValue = null,
        ?float $value = null
    )
    {
        $percentageCommission = $invoice->percentage_commission;
        $commercialPercentageCommission = $invoice->commercial_percentage;

        return [
            'number' => $invoice->number . ' - ' . $count,
            'due_date' => $dueDate,
            'value' => $value,
            'commission' => ($percentageCommission / 100) * $commissionBaseValue,
            'percentage_commission' => $percentageCommission ?? 0,
            'commercial_commission' => ($commercialPercentageCommission / 100) * $commissionBaseValue,
            'commercial_percentage' => $commercialPercentageCommission ?? 0,
            'paid_commission' => $dueDate->clone()->addMonth(),
            'paid_commercial' => $dueDate->clone()->addMonths(2),
            'invoice_id' => $invoice->id,
            'invoice_billet_status_id' => 1,
            'title_bearer' => 'Fornecedor',
        ];
    }
}
