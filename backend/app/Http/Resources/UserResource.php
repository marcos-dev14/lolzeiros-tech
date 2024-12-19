<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape(['id' => "mixed", 'name' => "mixed", 'email' => "mixed", 'avatar' => "mixed"])]
    public function toArray($request): array
    {
        $response = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => []
        ];

        if ($this->avatar && $this->avatar_path) {
            $avatar = asset("$this->avatar_path/$this->avatar");
            $response['avatar'] = [
                'JPG' => $avatar,
                'WEBP' => str_replace('jpg', 'webp', $avatar)
            ];
        }
        return $response;
    }
}
