<?php

namespace App\Models\Contracts;

/**
 * @property string $IMAGE_PATH
 * @property string $IMAGE_DIMENSIONS
 */
interface HasImageInterface
{
    public function getImagePath(): string|null;
}
