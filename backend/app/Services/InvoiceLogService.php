<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceLog;

class InvoiceLogService extends BaseService
{
    public function __construct()
    {
        $this->model = new InvoiceLog();
    }

    public function getMakeData(Invoice $invoice, string $logMessage): array
    {
        return [
            'user_id' => auth()->user()->id,
            'invoice_id' => $invoice->id,
            'mod' => $logMessage,
        ];
    }
}
