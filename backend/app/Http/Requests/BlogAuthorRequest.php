<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogAuthorRequest extends FormRequest
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
                'string'
            ],
            'slug' => [
                Rule::requiredIf(request()->has('name')),
                'string'
            ],
            'resume' => ['string', 'nullable'],
            'email' => ['string', 'email', 'nullable'],
            'instagram' => ['string', 'nullable'],
            'facebook' => ['string', 'nullable'],
            'youtube' => ['string', 'nullable'],
            'twitter' => ['string', 'nullable'],
            'biography' => ['string', 'nullable', 'max:200'],
            'use_card_on_post' => ['boolean', 'nullable'],
            'card_color' => ['string', 'nullable'],
            'image' => [
                'nullable',
                'mimes:jpeg,jpg,png'
            ],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge([
                'slug' => Str::slug($this->name)
            ]);
        }
    }
}
