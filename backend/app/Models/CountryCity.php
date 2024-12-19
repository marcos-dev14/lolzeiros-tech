<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CountryCity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'country_state_id',
    ];

    public function state(): BelongsTo
    {
        return $this->belongsTo(CountryState::class, 'country_state_id');
    }
}
