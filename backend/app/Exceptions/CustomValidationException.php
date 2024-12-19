<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use JetBrains\PhpStorm\Pure;

class CustomValidationException extends Exception
{
    #[Pure]
    public function __construct(protected Validator $validator, int $code = 422)
    {
        parent::__construct();
        $this->code = $code;
    }

    public function render(): JsonResponse
    {
        Log::error($this->validator->errors()->first());

        return response()->json([
            'success' => false,
            'message' => $this->validator->errors()->first(),
            'data' => $this->validator->errors()->toArray()
        ], $this->code);
    }
}
