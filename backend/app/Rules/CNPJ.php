<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CNPJ implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        // Extrai os números
        $document = preg_replace('/[^0-9]/is', '', $value);

        // Valida tamanho
        if (strlen($document) != 14) {
            return false;
        }

        // Verifica sequência de digitos repetidos. Ex: 11.111.111/111-11
        if (preg_match('/(\d)\1{13}/', $document)) {
            return false;
        }

        // Valida dígitos verificadores
        for ($t = 12; $t < 14; $t++) {
            for ($d = 0, $m = ($t - 7), $i = 0; $i < $t; $i++) {
                $d += $document[$i] * $m;
                $m = ($m == 2 ? 9 : --$m);
            }

            $d = ((10 * $d) % 11) % 10;

            if ($document[$i] != $d) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return trans('validation.cnpj');
    }
}
