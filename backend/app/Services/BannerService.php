<?php

namespace App\Services;

use App\Models\Admin\Banner\Block;

class BannerService extends BaseWithImageService
{
    public function __construct(protected ImageService $imageService) {
        parent::__construct($this->imageService);

        $this->model = new Block();
    }
}
