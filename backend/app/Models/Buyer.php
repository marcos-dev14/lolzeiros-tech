<?php

namespace App\Models;

use App\Casts\PascalCase;
use App\Notifications\PasswordReset;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class Buyer extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use SoftDeletes,
        HasApiTokens,
        Notifiable,
        CanResetPasswordTrait;

    protected string $guard = 'buyer';

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordReset($token));
    }

    public array $validationRules = [
        'name' => 'required',
        'email' => 'sometimes|email|unique:buyers',
        'role_id' => 'exists:roles,id',
    ];

    protected $fillable = [
        'name',
        'active',
        'cellphone',
        'email',
        'password',
        'role_id',
        'last_login',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'name' => PascalCase::class,
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function group(): HasOne
    {
        return $this->hasOne(ClientGroup::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function clients(): HasManyThrough
    {
        return $this->hasManyThrough(
            Client::class,
            ClientGroup::class,
            'buyer_id',
            'client_group_id',
            'id',
            'id'
        );
    }

    /* public function coupons(): HasMany
    {
        $client = $this->client;
        dd($client);
        return $this->hasMany(Coupon::class)
            ->where('validate', '>', now())
            ->where(function ($query) {
                $query->where('buyer_id', null)
                    ->where('seller_id', null)
                    ->where('client_profile_id', null);
            })->orWhere(function ($query) use ($client) {
                $query->where('buyer_id', $client->group->buyer_id)
                    ->orWhere('seller_id', $client->seller_id)
                    ->orWhere('client_profile_id', $client->profile->id);
            });

    } */

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getCanBeDeletedAttribute(): bool
    {
        return !($this->clients->count() > 0);
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    public function setEmailAttribute($email)
    {
        $this->attributes['email'] = Str::lower($email);
    }
}
