<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CountryState extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code'];

    public function cities(): HasMany
    {
        return $this->hasMany(CountryCity::class, 'country_state_id');
    }
}
