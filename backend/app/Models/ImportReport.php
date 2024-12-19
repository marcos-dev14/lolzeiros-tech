<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'line',
        'column_reference',
        'column_name',
        'product_reference',
        'status',
        'message',
        'import_id',
    ];

    public function import(): BelongsTo
    {
        return $this->belongsTo(Import::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_reference', 'reference');
    }
}
