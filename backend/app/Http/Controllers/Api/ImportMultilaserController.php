<?php

namespace App\Http\Controllers\Api;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use STS\Backoff\Backoff;

class ImportMultilaserController extends Controller
{
    protected $supplier;

    protected $brands;

    protected $categories;

    protected $products;

    public function __construct(
        private Backoff $_backoff,
        private $_baseUrl = 'http://services.multilaser.com.br/api',
        private $apiKey = 'd272991510e8ee8aaf4d2bf8f97e26d6562568b2',
        private $_endpoints = [
            'PRODUCTS' => 'products',
            'PRODUCT' => 'products/{productId}',
            'BRANDS' => 'brands',
            'CATEGORIES_BY_BRAND' => 'brands/{brandId}/family'
        ],
    ) {}

    public function index()
    {
        dd(10);
        $this->_backoff
            ->setMaxAttempts(10)
            ->setStrategy('exponential')
            ->setWaitCap(1000)
            ->setErrorHandler(function ($exception, $attempt, $maxAttempts) {
                dd($exception, $attempt, $maxAttempts);
            })->run(function () {
                $this->supplier = $this->getSupplier();
                $this->brands = $this->importBrands();
                $this->categories = $this->importCategories();
                $this->products = $this->importProducts();
            });

        dd('FOI');
    }

    protected function importProducts(): Collection
    {
        $apiProducts = $this->makeRequest($this->_endpoints['PRODUCTS'])->result;
        $formatedProducts = $this->getFormatedProducts($apiProducts);
        $interProducts = collect();

        dd($formatedProducts);

        foreach ($formatedProducts['products'] as $item) {
            $exists = Product::where('api_reference', $item['api_reference'])->first();

            if (!$exists) {
                try {
                    $exists = Product::create($item);
                } catch (\Exception $e) {
                    dd(2, $item, $e->getMessage(), $e->getLine());
                }
            }

            $interProducts->push($exists);
        }

        return $interProducts;
    }

    protected function getFormatedProducts($apiProducts)
    {
        Cache::forget('FORMATED_PRODUCTS');
        return Cache::rememberForever('FORMATED_PRODUCTS', function () use ($apiProducts) {
            $arrayProducts = [];
            $arrayNotFound = [];
            $arrayImages = [];

            foreach ($apiProducts as $item) {
                try {
                    $productResponse = $this->makeRequest(
                        str_replace('{productId}', $item->id, $this->_endpoints['PRODUCT'])
                    );

                    if (is_null($productResponse)) {
                        array_push($arrayNotFound, $item);
                        continue;
                    }

                    $product = $productResponse->product;
                    $category = $this->categories->where('reference', $product->family)->first();
                    $name = trim(preg_replace("/\s+/u", " ", $product->name));

                    $arrayProducts[$product->id] = [
                        'title' => $name,
                        'slug' => Str::slug($name),
                        'api_reference' => $product->id,
                        'use_video' => !empty($product->videos),
                        'youtube_link' => !empty($product->videos) ? $product->videos[0]->url : null,
                        'primary_text' => $this->getProductText($product),
                        'secondary_text' => $product->details ?? null,
                        'reference' => $product->id,
                        'ean13' => trim($product->ean),
                        'size_height' => $product->heigth,
                        'size_width' => $product->width,
                        'size_length' => $product->length,
                        'size_cubic' => ($product->heigth * $product->width * $product->length),
                        'size_weight' => $product->weight,
                        'unit_price' => $product->price,
                        'unit_price_promotional' => $product->minimum_price ?? 0,
                        'unit_minimal' => 1,
                        'unit_subtotal' => $product->minimum_price ?? $product->price,
                        'availability' => ucfirst(mb_strtolower($product->status)),
                        'seo_title' => substr(strip_tags($name), 0, 65),
                        'category_id' => $category->id,
                        'supplier_id' => $this->supplier->id,
                    ];

                    if ($product->id == 'BR069' || strpos($product->id, 'BR')) {
                        dd($product, $arrayProducts[$product->id]);
                    }

                    //if (!empty($product->image)) {
                        //$arrayImages[$product->id] = $this->extractImages($product->image);
                        //dd($arrayImages, $product, $arrayProducts[$product->id]);
                    //}
                } catch (\Exception $e) {
                    dd(1, $item, $e->getMessage(), $e->getLine());
                }
            }

            return [
                'products' => $arrayProducts,
                'not_found_products' => $arrayNotFound
            ];
        });
    }

    protected function extractImages(string $productId, array $images)
    {
        $images = collect($images);
        $images = $images->filter(function ($image) {
            dd($image);
        });
    }

    protected function getProductText($product): ?string
    {
        if (empty($product->specifications)) {
            return null;
        }

        $text = '';

        foreach ($product->specifications as $item) {
            $text .= "$item->legend: $item->value<br>";
        }

        return $text;
    }

    protected function importCategories(): Collection
    {
        $apiCategories = [];
        $interCategories = collect();

        foreach ($this->brands as $key => $brand) {
            $idx = $key + 1;
            $brandCategories = $this->makeRequest(
                str_replace('{brandId}', $idx, $this->_endpoints['CATEGORIES_BY_BRAND'])
            );

            $apiCategories = array_merge($apiCategories, $brandCategories->families);
        }

        $apiCategories = collect($apiCategories)->sortBy('id');
        $order = 1;

        foreach ($apiCategories as $apiCategory) {
            $name = ucfirst(trim(strtolower($apiCategory->name))) . " - $apiCategory->id";
            $exists = Category::where('slug', Str::slug($name))->first();

            if (!$exists) {
                $exists = Category::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'reference' => $apiCategory->id,
                    'order' => $order,
                    'supplier_id' => $this->supplier->id
                ]);

                $order++;
            }

            $interCategories->push($exists);
        }

        return $interCategories;
    }

    protected function importBrands(): Collection
    {
        $brands = $this->makeRequest($this->_endpoints['BRANDS'])->brands;
        $interBrands = collect();

        foreach ($brands as $brand) {
            $name = ucfirst(trim(strtolower($brand->name)));
            $exists = Brand::where('slug', Str::slug($name))->first();

            if (!$exists) {
                $exists = Brand::create([
                    'name' => $name,
                    'slug' => Str::slug($name)
                ]);
            }

            $interBrands->push($exists);
        }

        return $interBrands;
    }

    protected function getSupplier()
    {
        return Supplier::firstOrCreate([
            'company_name' => 'Multilaser'
        ], [
            'company_name' => 'Multilaser',
            'slug' => 'multilaser'
        ]);
    }

    protected function makeRequest($endpoint)
    {
        //Cache::forget(strtoupper("import_multilaser_$endpoint"));
        return Cache::rememberForever(strtoupper("import_multilaser_$endpoint"), function () use ($endpoint) {
            return Http::withHeaders(['X-Authorization' => $this->apiKey])
                ->accept('application/json')
                ->get("$this->_baseUrl/$endpoint")
                ->object();
        });
    }
}
