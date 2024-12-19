<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadTime extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }
}
