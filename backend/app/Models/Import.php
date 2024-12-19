<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Import extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'products_count',
        'errors',
        'initial_line',
        'new_register',
        'user_id',
        'supplier_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function columns(): HasMany
    {
        return $this->hasMany(ImportColumns::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ImportReport::class);
    }
}
