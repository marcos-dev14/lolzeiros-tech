<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'buyer_id',
    ];

    public array $validationRules = ['name' => 'required'];

    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class);
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
}
