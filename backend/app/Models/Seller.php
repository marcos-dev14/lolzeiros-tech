<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Crypt;

class Seller extends Authenticatable
{
    use SoftDeletes;
    protected string $guard = 'seller';
    public array $validationRules = [
        'name' => 'required',
        'email' => 'required|email|unique:sellers',
    ];

    protected $fillable = [
        'name',
        'password',
        'status',
        'avaliable_opportunity',
        'receive_inactive_customers',
        'origin',
        'portfolio_customer',
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

    public function ClientHasSeller()
    {
        return $this->hasMany(ClientHasSeller::class)
            ->with('clientGroup','supplier');
    }

    public function favoriteClients()
    {
        return $this->morphedByMany(Client::class, 'favoritable', 'favoritable')
            ->withTimestamps();
    }

    public function favoriteOrders()
    {
        return $this->morphedByMany(Order::class, 'favoritable', 'favoritable')
            ->withTimestamps();
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }
    
    public function setEmailAttribute($email)
    {
        $this->attributes['email'] = Str::lower($email);
    }
}
