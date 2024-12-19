<?php

namespace App\Http\Requests;

use App\Exceptions\CustomValidationException;
use App\Models\NavigationLink;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class NavigationLinkRequest extends FormRequest
{
    /**
     * @throws CustomValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        Log::error($validator->getMessageBag());
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
     *
     * @throws BindingResolutionException
     */
    public function rules(): array
    {
        $linkableIdRules = ['required_if:linkable_type,blog_post'];
        $type = $this->linkable_type;

        if ($type !== 'external') {
            $model = app()->make($this->linkable_type);
            $table = $model->getTable();

            $linkableIdRules[] = "exists:$table,id";
        }

        return [
            'label' => [
                Rule::requiredIf(request()->isMethod('POST')),
                'string',
            ],
            'navigation_id' => [
                Rule::exists('navigations', 'id')->withoutTrashed(),
            ],
            'order' => [
                'nullable',
                'integer',
            ],
            'linkable_type' => [
                'required',
            ],
            'linkable_id' => $linkableIdRules,
            'url' => 'required_if:linkable_type,external',
        ];
    }

    public function prepareForValidation()
    {
        $navigation = $this->route('navigation');
        if ($navigation) {
            $this->merge([
                'navigation_id' => ($navigation instanceof Model) ? $navigation->id : intval($navigation),
            ]);
        }

        $linkableType = (new NavigationLink())->types[$this->type] ?? 'external';
        $this->merge(['linkable_type' => $linkableType]);

        if ($this->type === 'blog_post') {
            $this->merge(['linkable_id' => $this->linkable_id]);
        }

        if (!empty($this->url) && $linkableType === 'external') {
            $baseUrl = rtrim(url(''), '/');
            $url = str_replace($baseUrl, '', $this->url);
            $this->merge(['url' => $url]);
        } else {
            $this->merge(['url' => null]);
        }
    }
}
