<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BuyerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "mixed",
        'name' => "string",
        'active' => "boolean",
        'can_be_deleted' => "boolean",
        'cellphone' => "string",
        'email' => "string",
        'group' => "mixed",
        'role' => "mixed",
        'clients' => "mixed",
        'last_login' => "string",
        'created_at' => "mixed",
        'updated_at' => "mixed",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'active' => $this->active,
            'can_be_deleted' => $this->can_be_deleted ? 1 : 0,
            'cellphone' => $this->cellphone,
            'email' => $this->email,
            'group' => new JustNameResource($this->group),
            'role' => new JustNameResource($this->role),
            'clients' => ClientListResource::collection($this->whenLoaded('clients')),
            'last_login' => $this->last_login,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
