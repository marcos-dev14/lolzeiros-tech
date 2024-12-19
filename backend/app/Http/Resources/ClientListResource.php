<?php

namespace App\Http\Resources;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ClientListResource extends JsonResource
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
        'company_name' => "string",
        'document' => "string",
        'status' => "string",
        'addresses' => "mixed",
        'main_address' => "mixed",
        'created_at' => "string",
        'updated_at' => "string",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'company_name' => $this->company_name,
            'document' => $this->document,
            'status' => $this->status,
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'main_address' => new AddressResource($this->mainAddress),
            'coupons' =>  $this->coupons(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    public function coupons()
    {
        $client = $this;
        $coupon = Coupon::where('validate', '>', now())
        ->where(function ($query) use ($client) {
            $query->whereNull('buyer_id')
                ->whereNull('seller_id')
                ->whereNull('client_group_id')
                ->whereNull('client_id')
                ->whereNull('client_profile_id');
        })
        ->orWhere(function ($query) use ($client) {
            if ($client->group->buyer_id) {
                $query->orWhere('buyer_id', $client->group->buyer_id);
            }

            if ($client->seller_id) {
                $query->orWhere('seller_id', $client->seller_id);
            }

            if ($client->id) {
                $query->orWhere('client_id', $client->id);
            }

            if ($client->client_group_id) {
                $query->orWhere('client_group_id', $client->client_group_id);
            }

            if ($client->profile?->id) {
                $query->orWhere('client_profile_id', $client->profile->id);
            }
        })->get()
        ->collect();

        return $coupon;
    }
}
