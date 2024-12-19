<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Artesaos\SEOTools\Facades\JsonLdMulti;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Support\Collection;
use Illuminate\Support\Collection as EloquentCollection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class BaseController extends Controller
{
    public function __construct(public ?object $defaultSeoData = null)
    {
        // load available Suppliers to Search Modal
        if (empty(session('filters.suppliers.available'))) {
            $this->getSuppliers();
        }

        $this->defaultSeoData = (object)config('seo_config');
    }

    protected function getSuppliers(int|array $selectedSupplierId = 0): Collection
    {
        $suppliers = Cache::remember('FILTERS_SUPPLIERS_AVAILABLE', now()->addMinutes(3), function () {
            return Supplier::isAvailable()
                ->whereHas('availableProducts')
                ->withCount('availableProducts')
                ->with([
                    'profileDoesntHaveCategoryDiscounts' => fn($query) => $query->select('id', 'type', 'discount_value', 'client_profile_id', 'supplier_id'),
                    'profileHasCategoryDiscounts' => fn($query) => $query->select('id', 'type', 'discount_value', 'client_profile_id', 'supplier_id'),
                    'blockingRules' => fn($query) => $query->select('id', 'name'),
                    'blockedStates' => fn($query) => $query->select('id', 'code', 'name'),
                    'fractionations' => fn($query) => $query->select('id', 'enable', 'client_profile_id', 'product_supplier_id'),
                ])
                ->orderBy('name')->get();
        });

        if (!empty($selectedSupplierId)) {
            $suppliers = $this->moveSelectedToTop($suppliers, $selectedSupplierId);
        }

        $suppliers = $this->prependAllOptionToCollection($suppliers, $selectedSupplierId);
        session(['filters.suppliers.available' => $suppliers]);

        return $suppliers;
    }

    protected function moveSelectedToTop(Collection $collection, array|int $selectedItems): Collection
    {
        $collection = $collection->sortBy('name');

        foreach ($collection as $key => $item) {
            if ($selectedItems == $item->id || (is_array($selectedItems) && in_array($item->id, $selectedItems))) {
                $current = $collection->pull($key);
                $current['checked'] = true;

                $collection->prepend($current, $key);
            }
        }

        return $collection;
    }

    protected function
    prependAllOptionToCollection(Collection $collection, array|int $selectedItems): EloquentCollection
    {
        return $collection->prepend((object)[
            'id' => 0,
            'name' => 'Todos',
            'checked' => !$selectedItems || $selectedItems == 0
        ]);
    }

    public function setPageSeo(?object $object = null): void
    {
        $seoData = $this->getDefaultData();

        if (!is_null($object)) {
            switch (get_class($object)) {
                case BlogPost::class:
                case Product::class:
                    $seoData = $this->getDataFromPostOrProduct($object, $seoData);
                    break;
                case Category::class:
                case BlogCategory::class:
                    $seoData = $this->getDataFromCategory($object, $seoData);
                    break;
                case \stdClass::class:
                    $seoData = $this->getDataFromGeneratedObject($object, $seoData);
                    break;
            }
        }

        $siteName = $this->defaultSeoData->site_name ?? config('app.name');
        $pageTitle = "$seoData->title | $siteName";

        SEOMeta::setTitle($pageTitle)
            ->setDescription($seoData->description)
            ->addKeyword($seoData->keywords)
            ->addMeta('author', 'TGOO Worldwide S.A.');

        OpenGraph::setDescription($seoData->description)
            ->setTitle($pageTitle)
            ->setUrl($seoData->url ?? url()->current())
            ->setSiteName($siteName)
            ->addProperty('locale', config('app.locale', 'pt-br'));

        if (!empty($seoData->type)) {
            OpenGraph::addProperty('type', 'article');
        }

        if (!empty($seoData->image_gallery) && count($seoData->image_gallery)) {
            foreach ($seoData->image_gallery as $image) {
                $stringDimensions = $image->dimensions;
                $dimensions = explode('x', $stringDimensions);
                OpenGraph::addImage($image->image, [
                    'height' => $dimensions[1],
                    'width' => $dimensions[0]
                ]);

                TwitterCard::setImage($image->image);
            }
        }

        TwitterCard::setTitle($pageTitle)
            ->setDescription($seoData->description)
            ->setUrl(url()->current());

        JsonLdMulti::setType('Organization')
            ->setTitle($siteName)
            ->setUrl(url('/'))
            ->setDescription($seoData->description)
            ->addValue('logo', [
                '@context' => 'https://schema.org',
                '@type' => 'ImageObject',
                'url' => asset('images/logo.svg')
            ]);

        if (!empty($seoData->jsonld)) {
            JsonLdMulti::newJsonLd();

            foreach ($seoData->jsonld as $key => $value) {
                JsonLdMulti::addValue($key, $value);
            }
        }
    }

    private function getDefaultData(): object
    {
        return (object)[
            'title' => $this->defaultSeoData?->page_title,
            'description' => $this->defaultSeoData?->seo_description ?? null,
            'keywords' => $this->defaultSeoData?->seo_keywords ?? null,
            'image' => null
        ];
    }

    private function getDataFromPostOrProduct(Product|BlogPost $object, object $seoData): object
    {
        $pageTitle = $object->seo_title ?? $object->title;

        if (!empty($pageTitle)) {
            $seoData->title = $pageTitle;
        }

        if (!empty($object->seo_keywords)) {
            $seoData->page_description = $object->seo_keywords;
        }

        $galleryImages = $object->images;
        if (count($galleryImages)) {
            $seoData->image_gallery = $galleryImages;
        }

        if (!empty($object->seo_description)) {
            $seoData->description = $object->seo_description;
        } elseif (!empty($object->primary_text)) {
            $seoData->description = Str::limit(strip_tags($object->primary_text), 166, null);
        } elseif (!empty($object->secondary_text)) {
            $seoData->description = Str::limit(strip_tags($object->secondary_text), 166, null);
        }

        if ($object instanceof Product) {
            $object->load('brand', 'category', 'route');
            $seoData->jsonld = (object)[
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $object->title,
                'description' => strip_tags($object->secondary_text . $object->primary_text),
                'category' => $object->category?->name,
                'keywords' => $object->seo_tags,
                'url' => url($object->route?->url),
                'brand' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Brand',
                    'logo' => asset("{$object->brand?->image_path}/{$object->brand?->image}"),
                    'name' => $object->brand?->name,
                    'url' => url("produtos?ma=[{$object->brand?->id}]")
                ]
            ];
        }

        if ($object instanceof BlogPost) {
            //$seoData->type = $object instanceof BlogPost ? 'Article' : 'Product';
        }

        return $seoData;
    }

    private function getDataFromCategory(?object $object, object $seoData): object
    {
        $seoData->title = $object->name;

        return $seoData;
    }

    private function getDataFromGeneratedObject(?object $object, object $seoData): object
    {
        if (!empty($object->title)) {
            $seoData->title = $object->title;
        }

        if (!empty($object->description)) {
            $seoData->description = $object->description;
        }

        if (!empty($object->tags)) {
            $seoData->keywords = $object->tags;
        }

        if (!empty($object->image)) {
            $seoData->image = $object->image;
        }

        return $seoData;
    }
}
