<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShippingCompany extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_name',
        'name',
        'document',
        'phone',
        'cellphone',
        'whatsapp',
        'email',
        'country_state_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    public function countryState(): BelongsTo
    {
        return $this->belongsTo(CountryState::class, 'country_state_id');
    }
}
