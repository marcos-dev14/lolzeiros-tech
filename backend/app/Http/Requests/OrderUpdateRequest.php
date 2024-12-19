<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use App\Models\OrderStatus;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;

class OrderUpdateRequest extends FormRequest
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
        'origin' => "string|null",
        'internal_comments' => "string",
        'seller_id' => "integer",
        'shipping_company_id' => "integer",
        'sale_channel_id' => "integer",
        'current_status' => "string",
        'external_order_id' => "string|null",
        'external_created_at' => "string|null"
    ])]
    public function rules(): array
    {
        $statuses = array_keys(((new OrderStatus)->statuses));

        return [
            'origin' => 'nullable|string',
            'internal_comments' => 'nullable|string',
            'seller_id' => ['nullable', Rule::exists('sellers', 'id')->withoutTrashed()],
            'shipping_company_id' => ['nullable', Rule::exists('shipping_companies', 'id')->withoutTrashed()],
            'sale_channel_id' => ['nullable', Rule::exists('sale_channels', 'id')],
            'current_status' => ['nullable', 'string', Rule::in($statuses)],
            'external_order_id' => ['nullable', 'string'],
            'external_created_at' => ['nullable', 'string'],
        ];
    }

    public function prepareForValidation(): void
    {
        $statuses = (new OrderStatus)->statuses;

        if ($this->current_status && in_array($this->current_status, $statuses)) {
            $statuses = array_flip($statuses);
            $this->merge(['current_status' => $statuses[$this->current_status]]);
        }
    }
}
