<?php

namespace App\Observers;

use App\Models\BlogPost;
use App\Services\RouteService;
use Exception;
use Illuminate\Support\Str;

class BlogPostObserver
{
    public function __construct(private RouteService $_routeService) {}

    /**
     * @throws Exception
     */
    public function created(BlogPost $post)
    {
        $generatedUrl = $post->generateUrl();
        $this->_routeService->store(
            $post,
            $this->_routeService->generateUniqueUrlByString($post, $generatedUrl)
        );
    }

    /**
     * @throws Exception
     */
    public function updating(BlogPost $post)
    {
        if (!empty($post->title) && empty($post->seo_title)) {
            $post->seo_title = Str::limit($post->title, 56, '');
        }

        if ($post->route == null) {
            $generatedUrl = $post->generateUrl();
            $this->_routeService->store(
                $post,
                $this->_routeService->generateUniqueUrlByString($post, $generatedUrl)
            );
        }
    }
}
