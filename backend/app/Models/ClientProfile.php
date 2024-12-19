<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientProfile extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    public array $validationRules = ['name' => 'required'];

    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
}
