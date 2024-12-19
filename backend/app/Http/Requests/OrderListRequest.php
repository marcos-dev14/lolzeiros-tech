<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use App\Models\OrderStatus;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;

class OrderListRequest extends FormRequest
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
        'code' => "string|null",
        'date' => "string|null",
        'by_product_supplier' => "integer|null",
        'by_seller' => "integer|null",
        'current_status' => "string|null",
        'by_client_group' => "integer|null",
        'by_country_city' => "integer|null",
        'by_country_state' => "integer|null"
    ])] public function rules(): array
    {
        $statuses = array_keys(((new OrderStatus)->statuses));

        return [
            'code' => 'nullable|string',
            'date' => 'nullable|string',
            'by_product_supplier' => ['nullable', Rule::exists('product_suppliers', 'id')->withoutTrashed()],
            'by_seller' => ['nullable', Rule::exists('sellers', 'id')->withoutTrashed()],
            'current_status' => ['nullable', 'string', Rule::in($statuses)],
            'by_client_group' => ['nullable', Rule::exists('client_groups', 'id')->withoutTrashed()],
            'by_country_city' => ['nullable', Rule::exists('country_cities', 'id')->withoutTrashed()],
            'by_country_state' => ['nullable', Rule::exists('country_states', 'id')],
        ];
    }

    public function prepareForValidation()
    {
        $statuses = (new OrderStatus)->statuses;
        if ($this->current_status && in_array($this->current_status, $statuses)) {
            $statuses = array_flip($statuses);
            $this->merge(['current_status' => $statuses[$this->current_status]]);
        }

        if ($this->start_date || $this->end_date) {
            $this->merge([
                'date' => "start:$this->start_date|end:$this->end_date"
            ]);
        }
    }
}
