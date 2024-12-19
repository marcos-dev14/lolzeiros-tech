<?php

namespace App\Models;

use App\Models\Contracts\HasImageInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogAuthor extends Model implements HasImageInterface
{
    use SoftDeletes, HasFactory;

    public string $IMAGE_PATH = 'blog/authors/{id}';

    public string $IMAGE_DIMENSIONS = '500x500';

    protected $fillable = [
        'name',
        'slug',
        'resume',
        'email',
        'instagram',
        'facebook',
        'youtube',
        'twitter',
        'biography',
        'use_card_on_post',
        'card_color',
        'image',
    ];

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setEmailAttribute($email)
    {
        $this->attributes['email'] = Str::lower($email);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
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

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
}
