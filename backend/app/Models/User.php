<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,
        HasFactory,
        Notifiable,
        SoftDeletes;

    const AVATAR_PATH = 'users/{id}';

    const AVATAR_DIMENSIONS = '200x200';

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * @return string[]
     */
    public function getFillable(): array
    {
        return $this->fillable;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getAvatarPathAttribute(): string|null
    {
        $path = str_replace('{id}', $this->id, self::AVATAR_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        return Storage::exists($path)
            ? asset(Storage::url($path))
            : null;
    }
}
