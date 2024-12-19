<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressRequest extends FormRequest
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
            'zipcode' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'street' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'number' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'complement' => 'nullable|string',
            'district' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'country_state_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('country_states', 'id'),
            ],
            'country_city_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('country_cities', 'id'),
            ],
            'address_type_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('address_types', 'id'),
            ]
        ];
    }

    public function prepareForValidation()
    {
        $this->mergeIfMissing([
            'address_type_id' => 2
        ]);
    }
}
