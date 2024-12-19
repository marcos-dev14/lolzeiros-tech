<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Znck\Eloquent\Traits\BelongsToThrough;

class Invoice extends Model
{
    use SoftDeletes;
    use BelongsToThrough;

    protected $fillable = [
        'number',
        'issuance_date',
        'date_promotion',
        'data_base',
        'value',
        'term_payment',
        'term_qty',
        'status',
        'term_day',
        'commission',
        'percentage_commission',
        'commercial_commission',
        'commercial_percentage',
        'observation',
        'order_status_id',
        'order_id',
        'created_at',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function supplier(): \Znck\Eloquent\Relations\BelongsToThrough
    {
        return $this->belongsToThrough(Supplier::class, Order::class);
    }

    public function client(): \Znck\Eloquent\Relations\BelongsToThrough
    {
        return $this->belongsToThrough(Client::class, Order::class);
    }

    public function invoiceBillets(): HasMany
    {
        return $this->HasMany(InvoiceBillet::class);
    }

    public function invoicesLogs(): HasMany
    {
        return $this->HasMany(InvoiceLog::class);
    }

    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class);
    }

    public function pdfsImports(): HasMany
    {
        return $this->HasMany(PdfImports::class);
    }
}
