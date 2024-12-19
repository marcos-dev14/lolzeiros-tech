<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class BuyerRequest extends FormRequest
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
            'active' => 'boolean',
            'email' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::unique('buyers', 'email')->whereNull('deleted_at')->ignore($this->buyer ?? null),
                'string',
                'email',
            ],
            'password' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Password::min(6),
                'confirmed',
                'string',
            ],
            'cellphone' => 'nullable|string',
            'group_name' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::unique('client_groups', 'name')
            ],
            'role_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('roles', 'id'),
            ]
        ];
    }

    public function prepareForValidation()
    {
        if ($this->group_name) {
            $this->merge([
                'group_name' => Str::slug($this->group_name) . "-" . rand(1111, 9999)
            ]);
        }
    }
}
