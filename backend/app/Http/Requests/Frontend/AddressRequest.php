<?php

namespace App\Http\Requests\Frontend;

use App\Models\CountryState;
use App\Services\CountryCityService;
use App\Services\CountryStateService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class AddressRequest extends FormRequest
{
    public function __construct(protected CountryStateService $stateService)
    {
        parent::__construct();
    }
    protected function failedValidation(Validator $validator)
    {
        return redirect()->back()
            ->with('errorForm', $validator->errors()->getMessages())
            ->withInput();
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
        'zipcode' => "string",
        'street' => "string",
        'number' => "string",
        'complement' => "string",
        'district' => "string",
        'country_state_id' => "string",
        'country_city_id' => "string",
        'address_type_id' => "string"
    ])]
    public function rules(): array
    {
        return [
            'zipcode' => 'required|string',
            'street' => 'required|string',
            'number' => 'required|string',
            'complement' => 'nullable|string',
            'district' => 'required|string',
            'country_state_id' => 'required|int|exists:country_states,id',
            'country_city_id' => 'required|int|exists:country_cities,id',
            'address_type_id' => 'required|exists:address_types,id',
        ];
    }

    /**
     * @throws Throwable
     */
    public function prepareForValidation()
    {
        try {
            $countryState = $this->stateService->getBy(request()->country_state, 'code');
        } catch (Throwable $e) {}

        $countryStateId = $countryState->id ?? 1;
        $this->merge([
            'country_state_id' => $countryStateId
        ]);
    }
}
