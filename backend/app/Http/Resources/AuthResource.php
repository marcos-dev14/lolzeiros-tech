<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class AuthResource extends JsonResource
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
        $user = $this['user'];
        $token = $this['token'];

        $response = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => [],
            'token' => $token
        ];

        if ($user->avatar && $user->avatar_path) {
            $avatar = asset("$user->avatar_path/$user->avatar");
            $response['avatar'] = [
                'JPG' => $avatar,
                'WEBP' => str_replace('jpg', 'webp', $avatar)
            ];
        }
        return $response;
    }
}
