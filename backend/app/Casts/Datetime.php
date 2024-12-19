<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Datetime implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return $value ? Carbon::createFromFormat('Y-m-d H:i:s', $value) : null;
    }

    public function set($model, string $key, $value, array $attributes)
    {
        if ($value instanceof Carbon) {
            return $value;
        }

        try {
            return $value ? Carbon::createFromFormat('d/m/Y H:i', $value) : null;
        } catch (\Exception $e) {
            dd(__FILE__, $e, $model, $key, $value);
        }
    }
}
