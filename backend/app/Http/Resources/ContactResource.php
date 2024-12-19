<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ContactResource extends JsonResource
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
        'cellphone' => "string|null",
        'phone' => "string|null",
        'phone_branch' => "string|null",
        'whatsapp' => "string|null",
        'email' => "string|null",
        'role' => "mixed",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cellphone' => $this->cellphone,
            'phone' => $this->phone,
            'phone_branch' => $this->phone_branch,
            'whatsapp' => $this->whatsapp,
            'email' => $this->email,
            'role' => new JustNameResource($this->whenLoaded('role')),
        ];
    }
}
