<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;

class ClientListRequest extends FormRequest
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
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    #[ArrayShape([
        'by_seller' => 'string',
        'by_client_group' => 'string',
        'by_client_pdv' => 'string',
        'by_client_profile' => 'string',
        'register_up' => 'string',
        'register_down' => 'string',
        'reference' => 'string',
        'search' => 'string',
        'last_order' => 'string',
        'unavailable' => 'string',
        'by_state' => 'string',
        'by_city' => 'string',
        'by_buyer' => 'string',
        'has_group' => 'string',
        'with_blocked_suppliers' => 'string',
        'without_blocked_suppliers' => 'string',
        'commercial_status' => 'string'
    ])]
    public function rules(): array
    {
        return [
            'by_seller' => 'string|exists:sellers,id,deleted_at,NULL',
            'by_client_group' => 'string|exists:client_groups,id,deleted_at,NULL',
            'by_client_pdv' => 'string|exists:client_pdvs,id,deleted_at,NULL',
            'by_client_profile' => 'string|exists:client_profiles,id,deleted_at,NULL',
            'register_up' => 'string',
            'register_down' => 'string',
            'reference' => 'nullable|string',
            'search' => 'string',
            'last_order' => 'numeric',
            'unavailable' => 'string',
            'commercial_status' => 'string',
            'has_group' => 'string',
            'by_state' => 'numeric|exists:country_states,id',
            'by_city' => 'numeric|exists:country_cities,id',
            'by_buyer' => 'numeric|exists:buyers,id,deleted_at,NULL',
            'with_blocked_suppliers' => 'string|exists:product_suppliers,id,deleted_at,NULL',
            'without_blocked_suppliers' => 'string|exists:product_suppliers,id,deleted_at,NULL',
        ];
    }
}
