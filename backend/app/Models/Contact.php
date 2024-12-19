<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Contact extends Model
{
    protected $fillable = [
        'contactable_type',
        'contactable_id',
        'name',
        'cellphone',
        'phone',
        'phone_branch',
        'whatsapp',
        'email',
        'role_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function contactable(): MorphTo
    {
        return $this->morphTo();
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
