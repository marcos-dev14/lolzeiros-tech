<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InvoiceBilletStatus extends Model
{

    protected $fillable = [
        'id',
        'name',
        'created_at',
    ];

}
