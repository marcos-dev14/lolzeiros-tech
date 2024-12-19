<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'label',
        'order',
        'fileable_type',
        'fileable_id',
    ];

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getUrlAttribute(): string
    {
        $basePath = $this->fileable::FILEABLE_PATH;
        $path = str_replace('{id}', $this->fileable?->id, $basePath);

        return Storage::url("$path/$this->name");
    }
}
