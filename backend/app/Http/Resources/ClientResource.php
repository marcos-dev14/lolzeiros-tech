<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "mixed",
        'company_name' => "mixed",
        'document' => "mixed",
        'suppliers' => "array",
        'orders' => "array",
        'cart' => "mixed",
        'profile' => "mixed",
        'group' => "mixed",
        'group_sum_clients' => "mixed",
        'buyer_id' => "mixed",
        'seller' => "mixed",
        'blocking_rule' => "mixed",
        'blocked_suppliers' => "mixed",
        'newsletter_tags' => "mixed",
        'commercial_status' => "mixed",
        'main_address' => "mixed",
        'address_state_city' => "mixed",
        'profile_name' => "mixed",
        'seller_name' => "mixed",
        'group_name' => "mixed",
        'created_at' => "mixed",
        'updated_at' => "mixed",
    ])]
    public function toArray($request): array
    {
        $siblings = $this?->group?->clients?->pluck('company_name');
        if ($siblings) {
            $siblings = implode(', ', $siblings->toArray());
        }

        $client = $this->resource;
        /* $suppliers = $client->getSuppliersData(); */
        $lastOrder = $client->orders->sortByDesc('id')->first();

        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'newsletter_tags' => $this->newsletter_tags,
            'document' => $this->document,
            'orders' => [
                'last_order' => new ClientListOrderResource($lastOrder),
                'count_orders' => $client->orders->count(),
            ],

            'cart' => $this->cart?->products?->count() ? new ClientListCartResource($client->cart) : null,

            $this->mergeWhen(!$request->routeIs('api.clients.index'), [
                'name' => $this->name,
                'document_status' => $this->document_status,
                'state_registration' => $this->state_registration,
                'code' => $this->code,
                'activity_start' => $this->activity_start,
                'activity_list' => $this->activity_list,
                'legal_representative_list' => $this->legal_representative_list,
                'joint_stock' => $this->joint_stock,
                'auge_register' => $this->auge_register,
                'has_ecommerce' => $this->has_ecommerce,
                'corporate_email' => $this->corporate_email,
                'website' => $this->website,
                'instagram' => $this->instagram,
                'facebook' => $this->facebook,
                'youtube' => $this->youtube,
                'twitter' => $this->twitter,
                'order_schedule' => $this->order_schedule,
                'order_balance' => $this->order_balance,
                'enter_price_on_order' => $this->enter_price_on_order,
                'can_migrate_service' => $this->can_migrate_service,
                'auto_observation_order' => $this->auto_observation_order,
                'blocked_suppliers' => JustNameResource::collection($this->blockedSuppliers),
                'contacts' => ContactResource::collection($this->contacts),
                'bank_accounts' => BankAccountResource::collection($this->bankAccounts),
                'addresses' => AddressResource::collection($this->addresses),
                'buyer' => new BuyerResource($this->buyer),
                'pdv_type' => new JustNameResource($this->pdvType),
                'tax_regime' => new JustNameResource($this->taxRegime),
                'origin' => new JustNameResource($this->origin),
                'same_group' => $siblings ?? null
            ]),

            'commercial_status' => $this->commercial_status,
            'main_address' => new AddressResource($this->main_address),
            'address_state_city' => "{$this->main_address?->state?->name} - {$this->main_address?->city?->name}",
            'group' => new JustNameResource($this->group),
            'group_name' => $this->group?->name,
            'group_sum_clients' => $this->group?->clients?->count() ?? 0,
            'buyer_id' => $this->buyer?->id,
            'seller' => new SellerResource($this->seller),
            'seller_name' => $this->seller?->name,
            'profile' => new JustNameResource($this->profile),
            'profile_name' => $this->profile?->name,
            'blocking_rule' => new JustNameResource($this->blockingRule),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
