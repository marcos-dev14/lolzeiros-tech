<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use App\Rules\CNPJ;
use App\Services\ApiDocumentResponseService;
use Exception;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class ClientRequest extends FormRequest
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

    public function __construct(
        protected ApiDocumentResponseService $apiDocumentResponseService
    ) {
        parent::__construct();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    #[ArrayShape([
        'activity_list' => 'string',
        'legal_representative_list' => 'string',
        'joint_stock' => 'string',
        'company_name' => 'string',
        'state_registration' => 'string',
        'website' => 'string',
        'instagram' => 'string',
        'facebook' => 'string',
        'youtube' => 'string',
        'twitter' => 'string',
        'commercial_status' => 'string',
        'name' => 'string',
        'document_status' => 'string',
        'auge_register' => 'string',
        'activity_start' => 'string',
        'address' => 'string',
        'contact' => 'string',
        'client_group_id' => 'string',
        'blocking_rule_id' => 'string',
        'client_pdv_id' => 'string',
        'client_profile_id' => 'string',
        'tax_regime_id' => 'string',
        'client_origin_id' => 'string',
        'seller_id' => 'string',
        'document' => 'string[]',
    ])]
    public function rules(): array
    {
        $documentRules = [new CNPJ()];

        if (request()->isMethod('POST')) {
            array_push($documentRules, Rule::unique('clients', 'document'));
            array_push($documentRules, 'required');
        }

        return [
            'company_name' => [
                'string',
                Rule::requiredIf(request()->isMethod('POST')),
            ],
            'state_registration' => ['nullable', 'string'],
            'website' => ['nullable', 'string'],
            'instagram' => ['nullable', 'string'],
            'facebook' => ['nullable', 'string'],
            'youtube' => ['nullable', 'string'],
            'twitter' => ['nullable', 'string'],
            'commercial_status' => ['nullable', 'string'],
            'activity_list' => ['nullable', 'string'],
            'legal_representative_list' => ['nullable', 'string'],
            'joint_stock' => ['nullable', 'string'],
            'name' => ['string', 'nullable'],
            'document_status' => 'nullable',
            'auge_register' => Rule::requiredIf(request()->isMethod('POST')),
            'activity_start' => ['nullable'],
            'address' => [
                'array',
                'nullable',
                Rule::requiredIf(request()->isMethod('POST')),
            ],
            'contact' => [
                'array',
                'nullable',
                Rule::requiredIf(request()->isMethod('POST')),
            ],
            'document' => $documentRules,
            'tax_regime_id' => 'nullable|exists:tax_regimes,id,deleted_at,NULL',
            'client_group_id' => 'nullable|exists:client_groups,id,deleted_at,NULL',
            'blocking_rule_id' => 'nullable|exists:blocking_rules,id,deleted_at,NULL',
            'client_pdv_id' => 'nullable|exists:client_pdvs,id,deleted_at,NULL',
            'client_origin_id' => 'nullable|exists:client_origins,id,deleted_at,NULL',
            'client_profile_id' => 'nullable|exists:client_profiles,id,deleted_at,NULL',
            'seller_id' => 'nullable|exists:sellers,id,deleted_at,NULL',
        ];
    }

    /**
     * @throws CustomValidationException|Throwable
     */
    public function prepareForValidation()
    {
        if (request()->isMethod('POST')) {
            try {
                $apiDocumentData = $this->apiDocumentResponseService->getData($this->document);
                $apiDocumentDataResponse = $apiDocumentData->response;

                $clientData = ['client_profile_id' => 1];

                $clientData = $this->apiDocumentResponseService->supplyArray($apiDocumentDataResponse, $clientData, [
                    'activity_list',
                    'legal_representative_list',
                    'joint_stock',
                    'company_name',
                    'name',
                    'document_status',
                    'auge_register',
                    'activity_start',
                    'address',
                    'contact',
                ]);

                $isInactive = $clientData['document_status'] !== 'Ativa';
                $clientData['seller_id'] = 13; // Inativo
                if ($isInactive) {
                    $clientData['seller_id'] = 14; // Inativo
                    $clientData['commercial_status'] = 'Inativo';
                }

                $this->merge($clientData);
            } catch (Exception $e) {
                $validator = \Illuminate\Support\Facades\Validator::make([], []);
                $validator->errors()->add(
                    'api_receita',
                    'A API da Receita Federal está indisponível no momento, tente novamente em 1 minuto'
                );

                Log::error($e->getMessage());

                throw new CustomValidationException($validator, 500);
            }
        }
    }
}
