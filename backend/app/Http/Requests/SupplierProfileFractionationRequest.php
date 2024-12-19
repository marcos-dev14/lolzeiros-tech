<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierProfileFractionationRequest extends FormRequest
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
            'enable' => [
                'required',
                'boolean',
            ],
            'client_profile_id' => [
                'required',
                Rule::exists('client_profiles', 'id')->withoutTrashed()
            ],
            'product_supplier_id' => [
                'required',
                Rule::exists('product_suppliers', 'id')->withoutTrashed()
            ]
        ];
    }

    public function prepareForValidation()
    {
        if ($this->supplier) {
            $this->merge([
                'product_supplier_id' => (int)$this->supplier
            ]);
        }
    }
}
