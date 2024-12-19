<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SupplierProfileFractionalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'enable' => "boolean",
        'profile' => "mixed"
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'enable' => $this->enable,
            'profile' => new JustNameResource($this->whenLoaded('profile')),
        ];
    }
}
