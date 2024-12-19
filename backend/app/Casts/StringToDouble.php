<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class StringToDouble implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param Model $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     * @return mixed
     */
    public function get($model, string $key, $value, array $attributes)
    {
        return $value;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param Model $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     * @return mixed
     */
    public function set($model, string $key, $value, array $attributes): float
    {
        $dotPosition = strpos($value, '.');
        $commaPosition = strpos($value, ',');
        $valueLenght = strlen($value);

        if ($dotPosition === $valueLenght - 3) { // 1,234.00
            $value = str_replace(',', '', $value); // 1234.00
        } elseif ($commaPosition === $valueLenght - 3) { // 1.234,00
            $value = str_replace('.', '', $value); // 1234,00
            $value = str_replace(',', '.', $value); // 1234.00
        } elseif ($dotPosition === false && $commaPosition !== false) {
            $value = str_replace(',','.', $value);
        }

        return doubleval($value);
    }
}
