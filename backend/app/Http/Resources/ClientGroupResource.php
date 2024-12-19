<?php

namespace App\Http\Resources;

use App\Models\Buyer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ClientGroupResource extends JsonResource
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
        'buyer' => "array",
        'count_clients' => "null|int",
    ])]
    public function toArray($request): array
    {
        $buyer = $this->buyer;
        $buyerData = [];

        if ($buyer instanceof Buyer) {
            $buyerData = [
                'id' => $buyer->id,
                'name' => $buyer->name,
                'email' => $buyer->email,
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'buyer' => $buyerData,
            'count_clients' => $this->clients_count,
            $this->mergeWhen(!$request->routeIs('api.groups.index'), [
                'clients' => ClientListResource::collection($this->whenLoaded('clients')),
            ])
        ];
    }
}
