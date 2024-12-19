<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;

class ShippingCompanyRequest extends FormRequest
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
    #[ArrayShape([
        'name' => "string|null",
        'company_name' => "string|null",
        'document' => "string|null",
        'phone' => "string|null",
        'cellphone' => "string|null",
        'whatsapp' => "string|null",
        'email' => "string|null",
        'country_state_id' => "integer"
    ])]
    public function rules(): array
    {
        return [
            'name' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'company_name' => ['nullable', 'string'],
            'document' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'cellphone' => ['nullable', 'string'],
            'whatsapp' => ['nullable', 'string'],
            'email' => ['nullable', 'string', 'email'],
            'country_state_id' => [
                'nullable',
                Rule::exists('country_states', 'id')
            ]
        ];
    }
}
