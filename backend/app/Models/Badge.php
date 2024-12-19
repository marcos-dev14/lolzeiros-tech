<?php

namespace App\Models;

use App\Models\Contracts\HasImageInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Badge extends Model implements HasImageInterface
{
    use HasFactory;

    public string $IMAGE_PATH = 'products/badges/{id}';

    public string $IMAGE_DIMENSIONS = '1200x1200';

    protected $table = 'product_badges';

    protected $fillable = [
        'name',
        'image',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getImageUrlAttribute(): string|null
    {
        return "$this->image_path/$this->image";
    }

    public function getImagePathAttribute(): string|null
    {
        $path = str_replace('{id}', $this->id, $this->IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        return Storage::exists($path)
            ? asset(Storage::url($path))
            : null;
    }

    public function getImagePath(): string|null
    {
        $path = str_replace('{id}', $this->id, $this->IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        return $path;
    }
}
