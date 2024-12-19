<?php

namespace App\Models;

use App\Casts\Money;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class SupplierPaymentPromotion extends Model
{
    protected $fillable = [
        'order_deadline',
        'min_value',
        'payment_term_start',
        'supplier_id',
    ];

    public array $validationRules = [
        'order_deadline' => 'required|date',
        'min_value' => 'required',
        'payment_term_start' => 'required|date',
        'supplier_id' => 'integer|exists:product_suppliers,id,deleted_at,NULL',
    ];

    protected $dates = ['order_deadline', 'payment_term_start'];

    protected $casts = [
        'min_value' => Money::class,
    ];

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeMinValue($query, $minValue)
    {
        return $query->where('min_value', '>=', $minValue);
    }

    public function scopeValid($query)
    {
        return $query->where('order_deadline', '>=', Carbon::now());
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function getHumanOrderDeadlineAttribute(): ?string
    {
        return $this->order_deadline instanceof Carbon
            ? $this->order_deadline->format('d/m/Y')
            : null;
    }

    public function getHumanPaymentTermStartAttribute(): ?string
    {
        return $this->payment_term_start instanceof Carbon
            ? $this->payment_term_start->format('d/m/Y')
            : null;
    }
}
