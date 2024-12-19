<?php

namespace App\Services;

use App\Models\BlogAuthor;

class BlogAuthorService extends BaseWithImageService
{
    public function __construct(protected ImageService $imageService) {
        parent::__construct($this->imageService);

        $this->model = new BlogAuthor();
    }
}
