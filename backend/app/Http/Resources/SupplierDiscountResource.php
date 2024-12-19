<?php

namespace App\Http\Resources;

use App\Http\Resources\Product\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierDiscountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        if ($this->type == 'state_discount') {
            return [
                'id' => $this->id,
                'discount_value' => $this->discount_value,
                'additional_value' => $this->additional_value,
                'states' => CountryStateResource::collection($this->states)
            ];
        }

        if ($this->type == 'profile_discount') {
            return [
                'id' => $this->id,
                'discount_value' => $this->discount_value,
                'auge_commission' => $this->auge_commission,
                'commercial_commission' => $this->commercial_commission,
                'valid_until' => $this->when(($this->categories->count() > 0), $this->valid_until),
                'client_profile_id' => $this->client_profile_id,
                'profile' => new JustNameResource($this->whenLoaded('profile')),
                'categories' => CategoryResource::collection($this->whenLoaded('categories'))
            ];
        }

        return [];
    }
}
