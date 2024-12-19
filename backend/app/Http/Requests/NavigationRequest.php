<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NavigationRequest extends FormRequest
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
            'location' => [
                Rule::in(['header', 'footer']),
                Rule::requiredIf(request()->isMethod('POST')),
            ],
            'title' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string'
            ],
            'order' => [
                'nullable',
                'integer'
            ],
        ];
    }
}
