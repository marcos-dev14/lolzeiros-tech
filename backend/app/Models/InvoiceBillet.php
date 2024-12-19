<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InvoiceBillet extends Model
{
    protected $fillable = [
        'id',
        'number',
        'invoice_id',
        'due_date',
        'value',
        'discount',
        'discounted_price',
        'commission',
        'percentage_commission',
        'commercial_commission',
        'commercial_percentage',
        'paid_commission',
        'paid_commercial',
        'paid_at',
        'invoice_billet_status_id',
        'observation',
        'title_bearer',
        'created_at',
    ];

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class, 'id', 'invoice_id');
    }

    public function invoiceBilletStatus(): HasOne
    {
        return $this->hasOne(InvoiceBilletStatus::class, 'id', 'invoice_billet_status_id');
    }

}

