<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientOrigin extends Model
{
    use SoftDeletes;

    public array $validationRules = ['name' => 'required'];

    protected $fillable = ['name'];

    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
}
