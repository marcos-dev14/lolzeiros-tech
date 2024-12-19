<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attribute extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_attributes';

    protected $fillable = [
        'name',
        'values',
        'order',
        'attribute_category_id',
    ];

    /**
     * @return string[]
     */
    public function getFillable(): array
    {
        return $this->fillable;
    }

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------
    public function category(): BelongsTo
    {
        return $this->belongsTo(AttributeCategory::class, 'attribute_category_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'product_has_attributes',
            'attribute_id')
        ->withPivot('order', 'value');
    }
}
