<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;

class BannerImageSortRequest extends FormRequest
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
        'images' => "array",
        'images.*.id' => "array",
        'images.*.order' => "array"
    ])]
    public function rules(): array
    {
        return [
            'images' => 'array',
            'images.*.id' => [
                'required_with:images',
                'distinct',
                Rule::exists('banner_images', 'id')
            ],
            'images.*.order' => [
                'required_with:images',
                'distinct',
                'integer',
            ]
        ];
    }
}
