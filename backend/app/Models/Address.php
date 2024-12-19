<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Address extends Model
{
    protected $fillable = [
        'addressable_type',
        'addressable_id',
        'zipcode',
        'street',
        'number',
        'complement',
        'district',
        'country_state_id',
        'country_city_id',
        'address_type_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(AddressType::class, 'address_type_id');
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(CountryState::class, 'country_state_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(CountryCity::class, 'country_city_id');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeMainAddress($query)
    {
        return $query->where('address_type_id', 1);
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getFullAddressAttribute(): string
    {
        $fullAddress = '';

        $fullAddress .= !empty($this->street) ? "$this->street" : null;
        $fullAddress .= !empty($this->number) ? " - $this->number" : null;
        $fullAddress .= !empty($this->complement) ? " - $this->complement" : null;
        $fullAddress .= '<br>';
        $fullAddress .= !empty($this->district) ? "$this->district" : null;
        $fullAddress .= !empty($this->city) ? " - {$this->city->name}" : null;
        $fullAddress .= !empty($this->state) ? " - {$this->state->code}" : null;
        $fullAddress .= '<br>';
        $fullAddress .= !empty($this->zipcode) ? "$this->zipcode" : null;

        return $fullAddress;
    }
}
