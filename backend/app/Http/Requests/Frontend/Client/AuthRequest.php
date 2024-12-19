<?php

namespace App\Http\Requests\Frontend\Client;

use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    #[ArrayShape([
        'email' => "string[]",
        'password' => "string[]",
        'remember' => "string[]",
        'captcha' => "string[]"
    ])]
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required'],
            'remember' => ['nullable', 'boolean'],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge(['remember' => $this->has('remember') && $this->remember == 'on']);
        $this->mergeIfMissing(['remember' => false]);
    }
}
