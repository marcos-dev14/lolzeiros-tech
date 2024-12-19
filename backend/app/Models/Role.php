<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = ['name'];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
}
