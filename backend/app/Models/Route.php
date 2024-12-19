<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'routable_type',
        'routable_id',
    ];

    public function routable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isAvailable(Model|null $routableInstance, string|null $url): bool
    {
        $query = self::query();

        if (!is_null($url)) {
            $query->where('url', $url);
        }

        if (!is_null($routableInstance)) {
            $query->where(function ($query) use ($routableInstance) {
                $query->where('routable_type', $routableInstance::class ?? null)
                    ->where('routable_id', '!=', $routableInstance->id ?? null);
            });
        }

        return !$query->count();
    }
}
