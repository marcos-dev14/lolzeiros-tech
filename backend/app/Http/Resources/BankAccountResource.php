<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class BankAccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape([
        'id' => "integer",
        'owner_name' => "string",
        'document' => "string|null",
        'account_number' => "string|null",
        'agency' => "string|null",
        'operation' => "string|null",
        'pix_key' => "string|null",
        'paypal' => "string|null",
        'bank' => "mixed",
    ])]
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'owner_name' => $this->owner_name,
            'document' => $this->document,
            'account_number' => $this->account_number,
            'agency' => $this->agency,
            'operation' => $this->operation,
            'pix_key' => $this->pix_key,
            'paypal' => $this->paypal,
            'bank' => new JustNameResource($this->whenLoaded('bank'))
        ];
    }
}
