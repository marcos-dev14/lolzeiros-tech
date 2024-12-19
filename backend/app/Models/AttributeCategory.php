<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttributeCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_attribute_categories';

    protected $fillable = ['name'];

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
    public function attributes(): HasMany
    {
        return $this->hasMany(Attribute::class, 'attribute_category_id', 'id');
    }

    protected function products(): HasMany
    {
        return $this->hasMany(Product::class, 'attribute_category_id', 'id');
    }
}
