<?php

namespace App\Models;

use App\Casts\StringToDouble;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SupplierDiscount extends Model
{
    protected $fillable = [
        'type',
        'discount_value',
        'additional_value',
        'auge_commission',
        'commercial_commission',
        'valid_until',
        'client_profile_id',
        'supplier_id',
    ];

    public function getStateDiscountFillable(): array
    {
        return [
            'discount_value',
            'additional_value',
            'states',
        ];
    }

    public function getProfileDiscountFillable(): array
    {
        return [
            'client_profile_id',
            'discount_value',
            'additional_value',
            'commercial_commission',
            'valid_until',
            'auge_commission',
            'categories',
        ];
    }

    protected $dates = ['valid_until'];

    protected $casts = [
        'discount_value' => StringToDouble::class,
        'additional_value' => StringToDouble::class,
        'commercial_commission' => StringToDouble::class,
    ];

    public array $stateDiscountValidationRules = [
        'discount_value' => 'nullable|numeric',
        'additional_value' => 'nullable|numeric',
        'states' => 'string|nullable',
        'type' => 'required',
        'supplier_id' => 'exists:product_suppliers,id,deleted_at,NULL',
    ];

    public array $profileDiscountValidationRules = [
        'discount_value' => 'nullable|numeric',
        'additional_value' => 'nullable|numeric',
        'commercial_commission' => 'nullable|numeric',
        'auge_commission' => 'nullable|numeric',
        'valid_until' => 'required_with:categories',
        'type' => 'required',
        'supplier_id' => 'exists:product_suppliers,id,deleted_at,NULL',
        'client_profile_id' => 'numeric|exists:client_profiles,id,deleted_at,NULL',
        'categories' => 'nullable|string',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function states(): BelongsToMany
    {
        return $this->belongsToMany(CountryState::class, 'supplier_states_discounts');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'supplier_categories_discounts');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeValid($query)
    {
        return $query->where('valid_until', '>=', Carbon::now()->format('Y-m-d'));
    }

    public function scopeStateDiscount($query)
    {
        return $query->where('type', 'state_discount')->with('states');
    }

    public function scopeProfileDiscount($query)
    {
        return $query->where('type', 'profile_discount')->with('categories');
    }
}
