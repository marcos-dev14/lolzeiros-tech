<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\AddressResource;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\BlogPostListResource;
use App\Http\Resources\ContactResource;
use App\Http\Resources\JustNameResource;
use App\Http\Resources\CommissionRuleResource;
use App\Http\Resources\CountryStateResource;
use App\Http\Resources\SupplierDiscountResource;
use App\Http\Resources\SupplierInstallmentRuleResource;
use App\Http\Resources\SupplierPaymentPromotionResource;
use App\Http\Resources\SupplierPhoneResource;
use App\Http\Resources\SupplierProfileFractionalResource;
use App\Http\Resources\SupplierPromotionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'name' => "string",
        'slug' => "string",
        'image' => "array",
        'is_available' => "boolean",
        'categories_count' => "integer",
        'products_count' => "integer",
        'products_available_count' => "integer",
        'last_imported_at' => "string",
        'created_at' => "string",
        'updated_at' => "string",
        'categories' => "\Illuminate\Http\Resources\Json\AnonymousResourceCollection",
    ])]
    public function toArray($request): array
    {
        $showData = [];

        if (!$request->routeIs('api.suppliers.index')) {
            $showData = [
                'company_name' => $this->company_name,
                'document' => $this->document,
                'document_status' => $this->document_status,
                'state_registration' => $this->state_registration,
                'code' => $this->code,
                'activity_start' => $this->activity_start,
                'status' => $this->status,
                'auge_register' => $this->auge_register,
                'corporate_email' => $this->corporate_email,
                'website' => $this->website,
                'instagram' => $this->instagram,
                'facebook' => $this->facebook,
                'youtube' => $this->youtube,
                'twitter' => $this->twitter,
                'commercial_status' => $this->commercial_status,
                'order_schedule' => $this->order_schedule,
                'order_balance' => $this->order_balance,
                'enter_price_on_order' => $this->enter_price_on_order,
                'can_migrate_service' => $this->can_migrate_service,
                'auto_observation_order' => $this->auto_observation_order,
                'min_ticket' => $this->min_ticket,
                'min_order' => $this->min_order,
                'fractional_box' => $this->fractional_box,
                'allows_reservation' => $this->allows_reservation,
                'client_mei_value' => $this->client_mei_value,
                'client_vip_value' => $this->client_vip_value,
                'client_premium_value' => $this->client_premium_value,
                'client_platinum_value' => $this->client_platinum_value,
                'service_migrate' => $this->service_migrate,
                'discount_type' => $this->discount_type,
                'lead_time' => new JustNameResource($this->leadTime),
                'shipping_type' => new JustNameResource($this->shippingType),
                'shipping_type_name' => $this->shippingType?->name,
                'blog_post' => new BlogPostListResource($this->whenLoaded('blogPost')),
                'tax_regime' => new JustNameResource($this->whenLoaded('taxRegime')),
                'phones' => SupplierPhoneResource::collection($this->whenLoaded('phones')),
                'commission_rules' => CommissionRuleResource::collection($this->whenLoaded('commissionRules')),
                'blocked_regions' => JustNameResource::collection($this->whenLoaded('blockedRegions')),
                'blocking_rules' => JustNameResource::collection($this->whenLoaded('blockingRules')),
                'blocked_states' => CountryStateResource::collection($this->whenLoaded('blockedStates')),
                'payment_promotions' => SupplierPaymentPromotionResource::collection($this->whenLoaded('paymentPromotions')),
                'installment_rules' => SupplierInstallmentRuleResource::collection($this->whenLoaded('installmentRules')),
                'state_discounts' => SupplierDiscountResource::collection($this->whenLoaded('stateDiscounts')),
                'profile_discounts' => SupplierDiscountResource::collection($this->whenLoaded('profileDiscounts')),
                'promotions' => SupplierPromotionResource::collection($this->whenLoaded('promotions')),
                'contacts' => ContactResource::collection($this->whenLoaded('contacts')),
                'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
                'bank_accounts' => BankAccountResource::collection($this->whenLoaded('bankAccounts')),
                'profile_fractionations' => SupplierProfileFractionalResource::collection($this->whenLoaded('fractionations'))
            ];
        }

        $response = [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,

            $this->mergeWhen(!$request->routeIs('api.suppliers.index'), $showData),

            'is_available' => (boolean)$this->is_available,
            'service_migrate' => $this->service_migrate,
            'categories_count' => $this->categories_count,
            'products_count' => $this->products_count,
            'products_available_count' => $this->available_products_count,
            'last_imported_at' => $this->last_imported_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'image' => [],
            'categories' => CategoryResource::collection($this->whenLoaded('categories'))
        ];

        if ($this->image && $this->image_path) {
            $image = asset("$this->image_path/$this->image");
            $response['image'] = [
                'JPG' => $image,
                'WEBP' => str_replace('jpg', 'webp', $image)
            ];
        }

        return $response;
    }
}
