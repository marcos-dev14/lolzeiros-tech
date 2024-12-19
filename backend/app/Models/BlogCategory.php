<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;
use Staudenmeir\LaravelAdjacencyList\Eloquent\Relations\HasManyOfDescendants;

class BlogCategory extends Model
{
    use SoftDeletes, HasRecursiveRelationships, HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
    ];

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------
    public function posts(): HasMany
    {
        return $this->hasMany(BlogPost::class);
    }

    public function recursivePosts(): HasManyOfDescendants
    {
        return $this->hasManyOfDescendantsAndSelf(BlogPost::class);
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getCustomPaths(): array
    {
        return [
            [
                'name' => 'slug_path',
                'column' => 'slug',
                'separator' => '/',
            ],
        ];
    }
}
