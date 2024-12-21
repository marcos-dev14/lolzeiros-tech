<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class Seller extends Model
{
    use SoftDeletes;

    public array $validationRules = [
        'name' => 'required',
        'email' => 'required|email|unique:sellers',
    ];

    protected $fillable = [
        'name',
        'password',
        'status',
        'avaliable_opportunity',
        'origin',
        'phone',
        'cellphone',
        'email',
        'created_at',
    ];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function blockedSuppliers()
    {
         return $this->hasMany(BlockedSupplier::class)->with('supplier');  
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setEmailAttribute($email)
    {
        $this->attributes['email'] = Str::lower($email);
    }
}
