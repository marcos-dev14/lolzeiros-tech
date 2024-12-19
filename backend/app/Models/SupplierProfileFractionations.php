<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierProfileFractionations extends Model
{
    protected $fillable = [
        'enable',
        'client_profile_id',
        'product_supplier_id',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'product_supplier_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }
}
