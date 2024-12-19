<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Cache;
use Watson\Sitemap\Facades\Sitemap;

class SitemapController extends Controller
{
    public function __invoke()
    {
        Sitemap::addTag(url('/'), null, 'daily', '1');

        $this->addProducts();
        $this->addPosts();

        return Sitemap::render();
    }

    protected function addProducts()
    {
        $products = Cache::remember('SITEMAP_PRODUCTS_CACHE', now()->addHours(4), function () {
            $availableSuppliers = Supplier::isAvailable()->selling()->select('id', 'name')->get();
            $suppliersIds = $availableSuppliers->pluck('id')->toArray();

            return Product::published()
                ->with('images')
                ->select('id', 'updated_at', 'title')
                ->whereIn('supplier_id', $suppliersIds)
                ->take(1000)
                ->get();
        });

        foreach ($products as $product) {
            $tag = Sitemap::addTag(
                route('route', $product->route?->url ?? 'null'),
                $product->updated_at->toIsoString(),
                'daily',
                '0.8'
            );

            $cover = $product->getCover();
            if ($cover) {
                $tag->addImage($cover->image, $product->title, null, $product->title);
            }

            foreach ($product->images as $image) {
                $tag->addImage($image->image, $image->label, null, $image->label);
            }
        }
    }

    protected function addPosts()
    {
        $posts = BlogPost::published()->with('images')->get();

        foreach ($posts as $post) {
            $tag = Sitemap::addTag(url("$post->url"), $post->updated_at->toIsoString(), 'daily', '0.8');

            $cover = $post->getCover();
            if ($cover) {
                $tag->addImage($cover->image, $post->title, null, $post->title);
            }

            foreach ($post->images as $image) {
                $tag->addImage($image->image, $image->label, null, $image->label);
            }
        }
    }
}
