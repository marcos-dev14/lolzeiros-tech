<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BankAccountRequest extends FormRequest
{
    /**
     * @throws CustomValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new CustomValidationException($validator);
    }

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
    public function rules(): array
    {
        return [
            'owner_name' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'document' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'bank_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('banks', 'id'),
            ],
            'account_number' => ['nullable', 'string'],
            'agency' => ['nullable', 'string'],
            'operation' => ['nullable', 'string'],
            'pix_key' => ['nullable', 'string'],
            'paypal' => ['nullable', 'string'],
        ];
    }
}
