<?php

namespace App\Http\Controllers\Frontend;

use App\Exceptions\ProductPriceException;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Client;
use App\Models\Product;
use App\Models\Route;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\View\View;

class RouteController extends BaseController
{
    protected string|null $baseCacheKey;

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $frontendUrl = config('custom.frontend_url');
        $currentUrl = url()->current();

        $path = str_replace($frontendUrl, '', $currentUrl);

        if ($path == 'blog') {
            $posts = BlogPost::published()->latest()->paginate();

            return view('pages.blog-posts', compact('posts'));
        }

        $route = Route::with('routable')->where('url', $path)->first();

        abort_if(!$route, 404);

        switch (true) {
            case $route->routable instanceof Product:
                $this->setPageSeo($route->routable);

                return $this->productPage($route->routable);
            case $route->routable instanceof BlogPost:
                $this->setPageSeo($route->routable);

                $post = $route->routable;
                $suppliers = Supplier::isAvailable()->whereHas('availableProducts')
                    ->select('id', 'name', 'image')
                    ->withCount('availableProducts')
                    ->get();

                return view('pages.blog-post', compact('post', 'suppliers'));
        }

        abort(404);
    }

    protected function productPage(Product $product): View
    {
//        $view = (!Product::published()->find($product->id))
//            ? 'pages.unavailable-product'
//            : 'pages.product';

        $selectedClient = session('buyer.clients.selected');
        $seller = $selectedClient?->seller;

        $availableSuppliers = $this->getSuppliers();
        $availableSuppliers = $availableSuppliers->filter(function ($supplier) use ($selectedClient) {
            if (!$selectedClient instanceof Client || $supplier->id === 0) {
                return false;
            }

            $clientCanBuy = $selectedClient->canBuyFromSupplier($supplier);

            return $clientCanBuy['can'];
        });

        $products = $this->getMoreProducts($product);
        $product->prices = $product->getPriceWithPromotionDiscounts(
            $product->in_cart_data['qty'] ?? $product->getMinimalQuantity()
        );

        $product->loadMissing('supplier', 'variations');
        $productSupplier = $product->supplier;
        $maxInstallments = $productSupplier?->max_installments ?? 0;

        return view('pages.product', compact(
            'product',
            'products',
            'selectedClient',
            'availableSuppliers',
            'seller',
            'maxInstallments'
        ));
    }

    protected function getMoreProducts(Product $product): Collection
    {
        $expectedProducts = 16;
        $products = collect([]);

        // Related products
        $relatedProducts = $product->related()->published()->take($expectedProducts)->get();
        $products = $products->concat($relatedProducts);
        if (count($products) >= $expectedProducts) return $products;

        // Same category
        if (!is_null($product->category_id)) {
            $categoryBuilder = $this->getProductEloquentBuilder();
            $categoryProducts = $categoryBuilder
                ->where('category_id', $product->category_id)
                ->whereNotIn('id', $products->pluck('id'))
                ->take(($expectedProducts - count($products)))
                ->inRandomOrder()->get();

            $products = $products->concat($categoryProducts);
            if (count($products) >= $expectedProducts) return $products;
        }

        // Same attribute category
        if (!is_null($product->attribute_category_id)) {
            $attributeBuilder = $this->getProductEloquentBuilder();
            $attributeProducts = $attributeBuilder
                ->where('attribute_category_id', $product->attribute_category_id)
                ->whereNotIn('id', $products->pluck('id'))
                ->take(($expectedProducts - count($products)))
                ->inRandomOrder()->get();

            $products = $products->concat($attributeProducts);
            if (count($products) >= $expectedProducts) return $products;
        }

        // Same supplier
        if (!is_null($product->supplier_id)) {
            $supplierBuilder = $this->getProductEloquentBuilder();
            $supplierProducts = $supplierBuilder
                ->where('supplier_id', $product->supplier_id)
                ->whereNotIn('id', $products->pluck('id'))
                ->take(($expectedProducts - count($products)))
                ->inRandomOrder()->get();

            $products = $products->concat($supplierProducts);
            if (count($products) >= $expectedProducts) return $products;
        }

        // Any products
        $anyBuilder = $this->getProductEloquentBuilder();
        $anyProducts = $anyBuilder->take(($expectedProducts - count($products)))->inRandomOrder()->get();

        return $products->concat($anyProducts);
    }

    protected function getProductEloquentBuilder(): Builder
    {
        return Product::with('images', 'supplier', 'brand')
            ->published()
            ->select(
                'id',
                'slug',
                'title',
                'inner_code',
                'reference',
                'supplier_id',
                'unit_price',
                'unit_price_promotional',
                'unit_minimal',
                'box_price',
                'box_price_promotional',
                'box_minimal',
                'dun14',
                'ean13',
                'icms',
                'ipi',
                'release_year',
                'ncm',
                'catalog_name',
                'origin',
                'box_packing_type',
                'category_id',
                'brand_id',
                'badge_id'
            );
    }
}
