<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class BankAccount extends Model
{
    protected $fillable = [
        'bankable_type',
        'bankable_id',
        'owner_name',
        'document',
        'account_number',
        'agency',
        'operation',
        'pix_key',
        'paypal',
        'bank_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function bankable(): MorphTo
    {
        return $this->morphTo();
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }
}
