<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceLog extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'invoice_id',
        'mod',
        'created_at',
    ];

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class, 'id', 'invoice_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
