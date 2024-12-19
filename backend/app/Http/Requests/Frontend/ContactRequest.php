<?php

namespace App\Http\Requests\Frontend;

use App\Models\CountryState;
use App\Services\CountryCityService;
use App\Services\CountryStateService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class ContactRequest extends FormRequest
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
        'name' => "string",
        'cellphone' => "string",
        'phone' => "string",
        'phone_branch' => "string",
        'whatsapp' => "string",
        'email' => "string",
        'role_id' => "string",
        'contact_id' => "string"
    ])]
    public function rules(): array
    {
        return [
            'name' => 'required',
            'cellphone' => 'nullable|min:15',
            'phone' => 'nullable|min:14',
            'phone_branch' => 'nullable',
            'whatsapp' => 'nullable|min:15',
            'email' => 'nullable|string|email',
            'role_id' => 'required|exists:roles,id',
            'contact_id' => 'nullable'
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'cellphone' => str_replace('_', '', request()->cellphone),
            'whatsapp' => str_replace('_', '', request()->whatsapp),
            'phone' => str_replace('_', '', request()->phone),
        ]);
    }
}
