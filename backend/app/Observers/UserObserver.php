<?php

namespace App\Observers;

use App\Models\User;
use App\Services\ImageService;

class UserObserver
{
    public function __construct(private ImageService $_imageService) {}

    public function deleting(User $user)
    {
        if (!empty($user->avatar)) {
            $this->_imageService->destroy($user->avatar_path, $user->avatar);
            $user->update(['avatar' => null]);
        }
    }
}
