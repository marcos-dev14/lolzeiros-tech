<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Date implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        if ($value instanceof Carbon) {
            return $value;
        }

        if (str_contains($value, 'Z') || str_contains($value, 'T')) {
            return Carbon::parse($value);
        }

        return $value ? Carbon::createFromFormat('Y-m-d', $value) : null;
    }

    public function set($model, string $key, $value, array $attributes)
    {
        if ($value instanceof Carbon) {
            return $value;
        }

        try {
            $value = substr($value, 0, 10);
            return $value ? Carbon::createFromFormat('Y-m-d', $value)->format('Y-m-d') : null;
        } catch (\Exception $e) {
            dd(__FILE__, $e, $model, $key, $value);
        }
    }
}
