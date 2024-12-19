<?php

namespace App\Models;

use App\Casts\StringToDouble;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierInstallmentRule extends Model
{
    protected $fillable = [
        'name',
        'min_value',
        'installments',
        'discount_value',
        'additional_value',
        'client_id',
        'supplier_id',
        'client_group_id',
    ];

    public array $validationRules = [
        'name' => 'nullable',
        'min_value' => 'required',
        'supplier_id' => 'integer|exists:product_suppliers,id,deleted_at,NULL',
        'client_id' => 'integer|nullable|exists:clients,id,deleted_at,NULL',
        'client_group_id' => 'integer|nullable|exists:client_groups,id,deleted_at,NULL',
    ];

    protected $casts = [
        'min_value' => StringToDouble::class,
        'discount_value' => StringToDouble::class,
        'additional_value' => StringToDouble::class,
    ];

    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function clientGroup(): BelongsTo
    {
        return $this->belongsTo(ClientGroup::class);
    }
}
