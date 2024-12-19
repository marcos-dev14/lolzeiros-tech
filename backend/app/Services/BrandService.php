<?php

namespace App\Services;

use App\Models\Brand;

class BrandService extends BaseWithImageService
{
    public function __construct(protected ImageService $imageService) {
        parent::__construct($this->imageService);

        $this->model = new Brand();
    }
}
