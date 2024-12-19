<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;

class OrderRequest extends FormRequest
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

    #[ArrayShape([
        'cart' => "integer",
        'instance' => "string",
        'installment_rule_id' => "integer|null",
        'shipping_company_id' => "string|null",
        'shipping_company.name' => "string|null",
        'shipping_company.document' => "string|null",
        'shipping_company.phone' => "string|null"
    ])] public function rules(): array
    {
        return [
            'cart' => ['required', Rule::exists('carts', 'id')->withoutTrashed()],
            'instance' => ['required', Rule::exists('cart_instances', 'uuid')],
            'installment_rule_id' => ['required', Rule::exists('supplier_installment_rules', 'id')],
            'shipping_company_id' => ['nullable', 'string'],
            'shipping_company.name' => [
                'nullable',
                'string',
                Rule::requiredIf($this->shipping_company_id === 'new')
            ],
            'shipping_company.document' => [
                'nullable',
                'string'
            ],
            'shipping_company.phone' => [
                'nullable',
                'string',
                Rule::requiredIf($this->shipping_company_id === 'new')
            ]
        ];
    }
}
