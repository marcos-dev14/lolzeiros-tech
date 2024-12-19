<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cart extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'client_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    protected function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function instances(): HasMany
    {
        return $this->hasMany(CartInstance::class);
    }

    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(
            CartInstanceProduct::class,
            CartInstance::class,
            'cart_id',
            'cart_instance_id',
            'id',
            'id'
        );
    }
}
