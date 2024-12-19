<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddressType extends Model
{
    protected $fillable = ['name'];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
