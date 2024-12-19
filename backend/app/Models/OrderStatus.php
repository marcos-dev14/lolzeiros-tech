<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderStatus extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'user_name',
        'order_id',
    ];

    public array $statuses = [
        'new' => 'Novo',
        'received' => 'Recebido',
        'transmitted' => 'Transmitido',
        'billed' => 'Faturado',
        'canceled' => 'Cancelado',
        'paused' => 'Pausado',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function getNameAttribute(): string
    {
        return $this->statuses[$this->attributes['name']];
    }
}
