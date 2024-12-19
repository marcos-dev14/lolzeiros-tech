<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    protected $fillable = ['name'];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function bankAccounts(): HasMany
    {
        return $this->hasMany(BankAccount::class);
    }
}
