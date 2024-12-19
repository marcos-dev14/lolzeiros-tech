<?php

namespace App\Models\Admin\Banner;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    const IMAGE_PATH = 'banners/blocks/{block_id}/images';

    protected $fillable = [
        'name', 'label', 'dimensions', 'order', 'link', 'platform', 'target',
        'imageping', 'published_at', 'published_end', 'block_id',
    ];

    protected $table = 'banner_images';

    public bool $preventAttrSet = false;

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------
    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setPublishedAtAttribute($date)
    {
        if (!empty($date)) {
            if (!$this->preventAttrSet) {
                $this->attributes['published_at'] = $date ? Carbon::createFromFormat('d/m/Y H:i', $date) : Carbon::now();
            } else {
                $this->attributes['published_at'] = $date;
            }
        }
    }

    public function setPublishedEndAttribute($date)
    {
        if (!empty($date)) {
            if (!$this->preventAttrSet) {
                $this->attributes['published_end'] = $date ? Carbon::createFromFormat('d/m/Y H:i', $date) : null;
            } else {
                $this->attributes['published_end'] = $date;
            }
        }
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getImageAttribute(): string
    {
        $path = str_replace('{block_id}', $this->block_id, self::IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        $file = "$path/$this->name";

        return Storage::exists($file)
            ? asset(Storage::url($file))
            : asset('images/default/product/default.jpg');
    }

    public function getWebpImageAttribute(): string
    {
        return (str_contains($this->image, 'default'))
            ? $this->image
            : str_replace('jpg', 'webp', $this->image);
    }
}
