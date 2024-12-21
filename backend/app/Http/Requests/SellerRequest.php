<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SellerRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'status' => 'string',
            'password' => 'string',
            'avaliable_opportunity' => 'string',
            'origin' => 'nullable|string',
            'email' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::unique('sellers', 'email')->ignore($this->seller ?? null),
                'string',
                'email',
            ],
            'phone' => 'nullable|string',
            'cellphone' => 'nullable|string',
        ];
    }

    /**
     * @throws CustomValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new CustomValidationException($validator);
    }
}
