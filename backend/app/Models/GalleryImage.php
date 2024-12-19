<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class GalleryImage extends Model
{
    protected $fillable = [
        'name',
        'label',
        'dimensions',
        'order',
        'main',
        'imageable_type',
        'imageable_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeSearch($query, $object)
    {
        return $query->where('imageable_type', $object::class)->where('imageable_id', $object->id);
    }

    public function scopeMain($query)
    {
        return $query->where('main', 1);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getImageAttribute(): string
    {
        $file = $this->getImagePath();

        return Storage::exists($file)
            ? Storage::url($file)
            : asset('images/default/product/default.jpg');
    }

    public function getWebpImageAttribute()
    {
        return (str_contains($this->image, 'default'))
            ? $this->image
            : str_replace('jpg', 'webp', $this->image);
    }

    public function getThumbAttribute(): string
    {
        $file = $this->getImagePath(true);

        return Storage::exists($file)
            ? Storage::url($file)
            : asset('images/default/product/thumb-default.jpg');
    }

    public function getWebpThumbAttribute()
    {
        return (str_contains('default', $this->thumb))
            ? $this->thumb
            : str_replace('jpg', 'webp', $this->thumb);
    }

    protected function getImagePath($thumb = false): string
    {
        $owner = $this->imageable;
        $path = str_replace('{id}', $owner->id, $owner::IMAGEABLE_PATH);

        if ($thumb) {
            $path .= '/thumbs';
        }

        $file = "$path/{$this->attributes['name']}";

        if (config('app.env') !== 'production') {
            $file = "public/$file";
        }

        return $file;
    }
}
