<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockingRule extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
}