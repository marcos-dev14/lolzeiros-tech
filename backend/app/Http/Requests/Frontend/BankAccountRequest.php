<?php

namespace App\Http\Requests\Frontend;

use App\Models\CountryState;
use App\Services\CountryCityService;
use App\Services\CountryStateService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class BankAccountRequest extends FormRequest
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
        'owner_name' => "string",
        'document' => "string",
        'account_number' => "string",
        'agency' => "string",
        'operation' => "string",
        'pix_key' => "string",
        'paypal' => "string",
        'bank_id' => "string",
        'bank_account_id' => "string"
    ])]
    public function rules(): array
    {
        return [
            'owner_name' => 'required',
            'document' => 'nullable',
            'account_number' => 'nullable',
            'agency' => 'nullable',
            'operation' => 'nullable|string',
            'pix_key' => 'nullable',
            'paypal' => 'nullable',
            'bank_id' => 'required|exists:banks,id',
            'bank_account_id' => 'nullable'
        ];
    }
}
