<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactRequest extends FormRequest
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
            'name' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'role_id' => [
                'nullable',
                Rule::exists('roles', 'id')
            ],
            'cellphone' => ['nullable', 'string', 'min:14'],
            'phone' => ['nullable', 'string'],
            'phone_branch' => ['nullable', 'string'],
            'whatsapp' => ['nullable', 'string'],
            'email' => ['nullable', 'string', 'email']
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'cellphone' => str_replace('_', '', request()->cellphone),
            'whatsapp' => str_replace('_', '', request()->whatsapp),
            'phone' => str_replace('_', '', request()->phone),
        ]);
    }
}
