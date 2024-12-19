<?php

namespace App\Models;

use App\Casts\StringToDouble;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class SupplierPromotion extends Model
{
    const BY_CATEGORY = 'categories';

    const BY_PRODUCT = 'products';

    public array $validationRules = [
        'supplier_id' => 'exists:product_suppliers,id,deleted_at,NULL',
        'discount_value' => 'required|numeric',
        'min_quantity' => 'required|numeric',
        'type' => 'in:categories,products',
    ];

    protected $fillable = [
        'discount_value',
        'min_quantity',
        'valid_until',
        'type',
        'supplier_id',
    ];

    protected $dates = ['valid_until'];

    protected $casts = [
        'discount_value' => StringToDouble::class,
    ];

    public function getFillable(): array
    {
        return $this->fillable;
    }

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function products(): MorphToMany
    {
        return $this->morphedByMany(Product::class, 'promotable', 'supplier_promotables');
    }

    public function categories(): MorphToMany
    {
        return $this->morphedByMany(Category::class, 'promotable', 'supplier_promotables');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeValid($query)
    {
        return $query->where(
            'valid_until',
            '>=',
            Carbon::now()->format('Y-m-d')
        )->where('discount_value', '>', 0.0);
    }
}
