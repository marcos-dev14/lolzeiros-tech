<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CartInstance extends Model
{
    protected $fillable = [
        'uuid',
        'cart_id',
        'product_supplier_id',
        'supplier_installment_rule_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'product_supplier_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(CartInstanceProduct::class);
    }

    public function installmentRule(): BelongsTo
    {
        return $this->belongsTo(SupplierInstallmentRule::class, 'supplier_installment_rule_id');
    }
}
