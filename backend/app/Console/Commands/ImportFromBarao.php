<?php

namespace App\Console\Commands;

use App\Helpers\UrlUploadedFile;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Services\GalleryService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;
use function App\Helpers\uploadedFileFromUrl;

class ImportFromBarao extends Command
{
    protected $signature = 'import-products:barao';

    protected $description = 'Import products from Barão';
    protected $supplier;
    protected $brands;
    protected $categories;
    protected $products;
    private $_soapClient;

    public function __construct(
        private GalleryService $_galleryService,
        private                $_baseUrl = 'http://179.131.12.83/apitoymania/apitoymania.php?wsdl',
        private                $_username = 'BARAO',
        private                $_password = 'cab123toy',
        private                $_endpoints = [
            'PRODUCTS' => 'estoqueListaGet',
            'PRODUCT' => 'produtoGet',
            'BRANDS' => 'marcaListaGet',
            'CATEGORIES' => 'categoriaListaGet'
        ]
    )
    {
        parent::__construct();

        $this->_soapClient = new \nusoap_client($this->_baseUrl);
        $this->_soapClient->setCredentials($this->_username, $this->_password);
    }

    #[NoReturn]
    public function handle()
    {
        $bar = $this->output->createProgressBar(4);

        $this->info("Importação iniciada...\n");

        $this->info('Cadastrar Representada!');
        $this->supplier = $this->getSupplier();
        $this->comment(" => Representada adicionada com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->info("\n\nImportar Marcas!");
        $this->brands = $this->importBrands();
        $this->comment("\n => Marcas importadas com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->info("\n\nImportar Categorias!");
        $this->categories = $this->importCategories();
        $this->comment("\n => Categorias importadas com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->info("\n\nImportar Produtos!");
        $this->products = $this->importProducts();
        $this->comment("\n => Produtos importados com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->info("\n\nImportação finalizada!!!");
    }

    protected function getSupplier()
    {
        return Supplier::firstOrCreate([
            'company_name' => 'Barão'
        ], [
            'company_name' => 'Barão',
            'slug' => 'barao'
        ]);
    }

    protected function importBrands(): Collection
    {
        $brands = $this->makeRequest($this->_endpoints['BRANDS']);
        $interBrands = collect();

        $bar = $this->output->createProgressBar(count($brands));
        foreach ($brands as $brand) {

            $name = ucfirst(trim(strtolower($brand->name)));
            $exists = Brand::where('slug', Str::slug($name))->first();

            if (!$exists) {
                $exists = Brand::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'api_reference' => $brand->id
                ]);
            }

            $interBrands->push($exists);

            $bar->advance();
        }

        return $interBrands;
    }

    protected function makeRequest($endpoint, $params = ['pagina' => 1])
    {
        $strParams = '';
        foreach ($params as $key => $param) {
            $strParams .= "{$key}_$param";
        }

        //Cache::forget(strtoupper("import_barao_{$endpoint}_$strParams"));
        return Cache::rememberForever(strtoupper("import_barao_{$endpoint}_$strParams"), function () use ($endpoint, $params) {
            $response = $this->_soapClient->call($endpoint, $params);

            return json_decode((string)$response);
        });
    }

    protected function importCategories(): Collection
    {
        $apiCategories = $this->makeRequest($this->_endpoints['CATEGORIES']);
        $interCategories = collect();
        $order = 1;

        $bar = $this->output->createProgressBar(count($apiCategories));

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
            $bar->advance();
        }

        return $interCategories;
    }

    protected function importProducts(): Collection
    {
        $this->info("\n 1/3. Obter lista de Produtos");
        $apiProducts = $this->getApiProducts();
        $this->comment(" => " . count($apiProducts) . " produtos obtidos!");

        $this->info("\n 2/3. Formatar Produtos");
        $formatedProducts = $this->getFormatedProducts($apiProducts);
        $this->comment("\n => Produtos formatados com sucesso.\n");

        $interProducts = collect();

        $bar = $this->output->createProgressBar(count($formatedProducts['products']));

        $this->info(" 3/3. Cadastrar produtos formatados");

        foreach ($formatedProducts['products'] as $item) {
            $exists = Product::where('api_reference', $item['api_reference'])->first();

            if (!empty($item['images'])) {
                $this->importProductsImages($exists, $item['images']);
            }
            unset($item['images']);

            if (!$exists) {
                try {
                    $exists = Product::create($item);
                } catch (\Exception $e) {
                    dd(2, $item, $e->getMessage(), $e->getLine());
                }
            }

            $interProducts->push($exists);

            $bar->advance();
        }

        return $interProducts;
    }

    protected function getApiProducts()
    {
        $page = 1;

        //Cache::forget('API_PRODUCTS');
        return Cache::rememberForever('API_PRODUCTS', function () use ($page) {
            $apiProducts = $this->makeRequest($this->_endpoints['PRODUCTS'], ['pagina' => $page]);
            $pagesData = array_shift($apiProducts);
            $page++;

            while ($page < $pagesData->pages) {
                $temp = $this->makeRequest($this->_endpoints['PRODUCTS'], ['pagina' => $page]);

                array_shift($temp);
                $apiProducts = array_merge($apiProducts, $temp);

                $page++;
            }

            return $apiProducts;
        });
    }

    protected function getFormatedProducts($apiProducts)
    {
        //Cache::forget('FORMATED_PRODUCTS');
        return Cache::rememberForever('FORMATED_PRODUCTS', function () use ($apiProducts) {
            $arrayProducts = [];
            $arrayNotFound = [];

            $bar = $this->output->createProgressBar(count($apiProducts));

            foreach ($apiProducts as $item) {
                try {
                    $product = $this->makeRequest($this->_endpoints['PRODUCT'], ['id' => $item->id]);

                    if (is_null($product)) {
                        array_push($arrayNotFound, $item);
                        continue;
                    }

                    $category = $this->getCategoryByProduct($product);
                    $brand = $this->getBrandByProduct($product);
                    $name = utf8_decode(utf8_encode(trim(preg_replace("/\s+/u", " ", $product->title))));

                    $arrayProducts[$product->id] = [
                        'title' => $name,
                        'slug' => Str::slug($name),
                        'api_reference' => $product->id,
                        'use_video' => !empty($product->videoUrl),
                        'youtube_link' => $product->videoUrl ?? null,
                        'primary_text' => $product->description ?? null,
                        'secondary_text' => $this->getProductText($product),
                        'reference' => $product->code,
                        'ean13' => trim($product->ean),
                        'size_height' => $product->height,
                        'size_width' => $product->width,
                        'size_length' => $product->length,
                        'size_cubic' => ($product->height * $product->width * $product->length),
                        'size_weight' => $product->weight,
                        'unit_price' => $product->price,
                        'unit_price_promotional' => null,
                        'unit_minimal' => 1,
                        'unit_subtotal' => $product->price,
                        'availability' => 'Disponível',
                        'seo_title' => Str::limit(strip_tags($name), 65, null),
                        'category_id' => $category->id ?? null,
                        'supplier_id' => $this->supplier->id,
                        'brand_id' => $brand->id ?? null,
                        'images' => $product->images
                    ];

                    $bar->advance();
                } catch (\Exception $e) {
                    dd(10, $item, $e->getMessage(), $e->getLine());
                }
            }

            return [
                'products' => $arrayProducts,
                'not_found_products' => $arrayNotFound
            ];
        });
    }

    protected function getCategoryByProduct($product): ?Category
    {
        $level2 = $product->categoryLevel2;
        $level1 = $product->categoryLevel1;

        if (empty($level2->id) && empty($level1->id)) {
            return null;
        }

        $category = $this->categories->where('reference', $level2->id)->first();

        if ($category) {
            return $category;
        }

        return $this->categories->where('reference', $product->categoryLevel1)->first();
    }

    protected function getBrandByProduct($product): ?Brand
    {
        if (empty($product->brand->id)) {
            return null;
        }

        return $this->brands->where('api_reference', $product->brand->id)->first();
    }

    protected function getProductText($product): ?string
    {
        if (empty($product->characteristics)) {
            return null;
        }

        $text = '';

        foreach ($product->characteristics as $item) {
            $text .= "$item->name: $item->value<br>";
        }

        return $text;
    }

    protected function importProductsImages(Product $product, $images = []): void
    {
        $arrImages = [];
        foreach ($images as $image) {
            try {
                $arrImages[] = uploadedFileFromUrl($image->url);
            } catch (\Exception $e) {
                //dd(228, $e->getMessage());
            }
        }

        $path = str_replace('{id}', $product->id, Product::IMAGEABLE_PATH);

        try {
            $this->_galleryService->store(
                $product,
                $arrImages,
                $path,
                '1200x1200',
                "$product->title-$product->reference"
            );
        } catch (\Exception $e) {
            //dd($e->getMessage());
        }
    }
}
