<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Seller extends Model
{
    use SoftDeletes;

    public array $validationRules = [
        'name' => 'required',
        'email' => 'required|email|unique:sellers',
    ];

    protected $fillable = [
        'name',
        'phone',
        'cellphone',
        'email',
    ];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setEmailAttribute($email)
    {
        $this->attributes['email'] = Str::lower($email);
    }
}
