<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SupplierRequest extends FormRequest
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
            'company_name' => Rule::requiredIf(request()->isMethod('POST')),
            'image' => ['nullable', 'mimes:jpeg,jpg,png'],
            'lead_time_id' => [
                'nullable',
                Rule::exists('lead_times', 'id')->withoutTrashed()
            ],
            'shipping_type_id' => [
                'nullable',
                Rule::exists('shipping_types', 'id')->withoutTrashed()
            ],
            'tax_regime_id' => [
                'nullable',
                Rule::exists('tax_regimes', 'id')->withoutTrashed()
            ],
            'blog_post_id' => [
                'nullable',
                Rule::exists('blog_posts', 'id')->withoutTrashed()
            ],
            'name' => ['nullable'],
            'slug' => [
                Rule::requiredIf(request()->has('company_name')),
                'string'
            ],
            'is_available' => ['nullable'],
            'document' => ['nullable'],
            'document_status' => ['nullable'],
            'state_registration' => ['nullable'],
            'code' => ['nullable'],
            'activity_start' => ['nullable'],
            'status' => ['nullable'],
            'auge_register' => ['nullable'],
            'corporate_email' => ['nullable', 'email'],
            'website' => ['nullable'],
            'instagram' => ['nullable'],
            'facebook' => ['nullable'],
            'youtube' => ['nullable'],
            'twitter' => ['nullable'],
            'suspend_sales' => ['nullable'],
            'commercial_status' => ['nullable'],
            'order_schedule' => ['nullable'],
            'order_balance' => ['nullable'],
            'enter_price_on_order' => ['nullable'],
            'can_migrate_service' => ['nullable'],
            'auto_observation_order' => ['nullable'],
            'last_imported_at' => ['nullable'],
            'last_but_one_imported_at' => ['nullable'],
            'min_ticket' => ['nullable'],
            'min_order' => ['nullable'],
            'fractional_box' => ['nullable'],
            'allows_reservation' => ['nullable'],
            'client_mei_value' => ['nullable'],
            'client_vip_value' => ['nullable'],
            'client_premium_value' => ['nullable'],
            'client_platinum_value' => ['nullable'],
            'discount_type' => ['nullable'],
            'service_migrate' => ['string'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->image == [] || $this->image == '[]') {
            $this->request->remove('image');
        }

        if ($this->company_name) {
            $this->merge([
                'slug' => Str::slug($this->company_name)
            ]);
        }
    }
}
