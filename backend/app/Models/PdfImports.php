<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PdfImports extends Model
{
    protected $fillable = [
        'name',
        'invoice_id',
        'file_path',
        'created_at',
    ];

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class, 'id', 'invoice_id');
    }
}
