<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
                'min:4',
            ],
            'slug' => [
                'required',
                'string'
            ],
            'reference' => [
                'nullable',
                'string'
            ],
            'supplier_id' => [
                Rule::requiredIf(request()->isMethod('POST')),
                Rule::exists('product_suppliers', 'id')->withoutTrashed()
            ],
            'order' => [
                'nullable',
                'integer'
            ],
        ];
    }

    protected function prepareForValidation()
    {
        $supplier = $this->route('supplier');
        if ($supplier) {
            if ($supplier instanceof Model) {
                $supplier = $supplier->id;
            }

            $this->merge([
                'supplier_id' => intval($supplier)
            ]);
        }

        if ($this->name) {
            $this->merge([
                'slug' => Str::slug($this->name)
            ]);
        }
    }
}
