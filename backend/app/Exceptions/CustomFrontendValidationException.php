<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\RedirectResponse;
use JetBrains\PhpStorm\Pure;

class CustomFrontendValidationException extends Exception
{
    #[Pure]
    public function __construct(protected Validator $validator)
    {
        parent::__construct();
    }

    public function render(): RedirectResponse
    {
        return redirect()->back()->with(
            'error',
            $this->validator->errors()->first()
        )->withInput();
    }
}
