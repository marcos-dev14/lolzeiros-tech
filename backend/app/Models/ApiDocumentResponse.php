<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiDocumentResponse extends Model
{
    protected $fillable = [
        'document',
        'response',
    ];

    public function getResponseAttribute()
    {
        return unserialize($this->attributes['response']);
    }
}
