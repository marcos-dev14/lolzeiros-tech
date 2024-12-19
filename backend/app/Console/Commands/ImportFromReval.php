<?php

namespace App\Console\Commands;

use App\Enums\Product\AvailabilityType;
use App\Enums\Product\OriginType;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Supplier;
use App\Services\GalleryService;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;
use function App\Helpers\uploadedFileFromBase64;

class ImportFromReval extends Command
{
    protected $signature = 'import-products:reval';

    protected $description = 'Import products from Reval';
    protected ?string $apiToken;

    protected ?string $apiUser;

    protected ?string $apiPassword;

    protected string $apiBaseUrl;

    protected Supplier $supplier;

    protected array $availabilityFields = ['B', 'R', 'N', 'A', 'G'];

    public function __construct(
        private GalleryService $_galleryService,
    ) {
        parent::__construct();

        $this->apiToken = config('services.reval.token');
        $this->apiBaseUrl = 'http://api.reval.net/api';
        $this->apiUser = 'cl197239';
        $this->apiPassword = 't03yaA5M';
    }

    #[NoReturn]
    public function handle(): void
    {
        $bar = $this->output->createProgressBar(2);
        $this->info("Verificando Conexão...\n");
        $this->reconect();
        $this->info("Importação iniciada...\n");

        $this->info('Cadastrar Representada!');
        $this->supplier = $this->getSupplier();
        $this->comment(" => Representada adicionada com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->info("\n\nImportar Produtos!");
        $this->importProducts();
        $this->comment("\n => Produtos importados com sucesso.\n");
        $this->comment('Estado do processo de importação');
        $bar->advance();

        $this->updateSupplierImportedAtDates();

        $this->info("\n\nImportação finalizada!!!");
    }

    public function reconect(): void
    {
        $settings = Setting::first();

        if (!$settings instanceof Setting) {
            $settings = Setting::create(['reval_key' => 'empty']);
        }

        $updatedAt = $settings->updated_at;
        $diffInHours = $updatedAt->diffInHours(now());

        if ($diffInHours > 23 || $settings->reval_key === 'empty') {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
            ])->get("$this->apiBaseUrl/get-token?username=$this->apiUser&password=$this->apiPassword")->object();

            $settings->reval_key = $response->access_token;
            $settings->save();
        }

        $this->apiToken = $settings->reval_key;
    }

    protected function getSupplier(): Supplier
    {
        return Supplier::firstOrCreate([
            'company_name' => 'Reval'
        ], [
            'company_name' => 'Reval',
            'slug' => 'reval',
            'fractional_box' => 1
        ]);
    }

    protected function importProducts(): void
    {
        $this->info("\n 1/4. Obter lista de Produtos");
        $apiProducts = collect($this->getApiProducts());
        $this->info("\n 2/5. Limpar produtos internos");
        $this->clearProducts($apiProducts);
        $this->info("\n 2.5/5. Status de Produtos");
        $this->emptyStockProducts($apiProducts);
        $this->info("\n 3/5. Formatar Produtos");
        $formatedProducts = $this->getFormatedProducts($apiProducts);
        $this->comment("\n => Produtos formatados com sucesso.\n");

        $bar = $this->output->createProgressBar(count($formatedProducts['products']));

        $this->info(" 4/5. Cadastrar produtos formatados");

        $allProducts = Product::where('supplier_id', $this->supplier->id)->get();

        foreach ($formatedProducts['products'] as $item) {
            $item = (object) $item;

            $exists = $allProducts->firstWhere('api_reference', $item->api_reference);

            if (!$exists) {
                try {
                    $category = $this->firstOrCreateCategory($item);
                    $brand = $this->firstOrCreateBrand($item);
                    $item->brand_id = $brand?->id;
                    $item->category_id = $category?->id;
                    unset($item->lista, $item->marca);

                    if ($item->title !== null) {
                        Product::create((array) $item);
                    }
                } catch (Exception $e) {
                    dd($e->getMessage(), $e->getLine());
                }
            } else {
                $updatedAtdate = Carbon::createFromFormat('dmY', $item->dataAttProduto);
                $productUpdatedAtDate = $exists->updated_at;

                if (
                    $updatedAtdate->gt($productUpdatedAtDate) && (
                        $item->unit_price !== $exists->unit_price
                        || $item->box_price !== $exists->box_price
                        || $item->cfop !== $exists->cfop
                        || $item->availability !== $exists->availability
                    )
                )

                    if ($item->availability == 'Outlet') {
                        $exists->update([
                            'unit_price' => $item->unit_price,
                            'box_price' => $item->box_price,
                            'cfop' => $item->cfop,
                            'availability' => $item->availability,
                            'badge_id' => 25,
                            'packaging' => $item->packaging,
                            'display_code' => $item->display_code,
                            'dun14' => $item->dun14,
                            'replacement' => $item->replacement
                        ]);
                    } else {
                        $exists->update([
                            'unit_price' => $item->unit_price,
                            'box_price' => $item->box_price,
                            'cfop' => $item->cfop,
                            'availability' => $item->availability,
                            'packaging' => $item->packaging,
                            'display_code' => $item->display_code,
                            'dun14' => $item->dun14,
                            'replacement' => $item->replacement
                        ]);
                    }
            }

            $bar->advance();
        }

        $this->info(" 5/5. Importar imagens");
        $allProducts = Product::with('images')
            ->whereDoesntHave('images')
            ->where('supplier_id', $this->supplier->id)
            ->get();
        $bar = $this->output->createProgressBar($allProducts->count());

        foreach ($allProducts as $item) {
            $product = $allProducts->firstWhere('api_reference', $item->api_reference);

            if ($product instanceof Product) {
                $this->importProductsImages($product);
            }

            $bar->advance();
        }
    }

    protected function getApiProducts()
    {
        //Cache::forget('API_REVAL_PRODUCTS');
        return Cache::remember('API_REVAL_PRODUCTS', now()->addHours(20), function () {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
            ])->get("$this->apiBaseUrl/produto/get-all-tabela?usuario=$this->apiUser");
            $apiProducts = $response->json();
            $this->info("\n 1/4. Obter lista de Produtos");

            $this->comment(" => " . count($apiProducts) . " produtos obtidos!");

            return $apiProducts;
        });
    }

    protected function getFormatedProducts($apiProducts)
    {
        Cache::forget('REVAL_FORMATED_PRODUCTS');
        return Cache::remember('REVAL_FORMATED_PRODUCTS', now()->addHours(20), function () use ($apiProducts) {
            $arrayProducts = [];
            $arrayNotFound = [];

            $bar = $this->output->createProgressBar(count($apiProducts));

            foreach ($apiProducts as $product) {
                try {
                    $product = (object) $product;

                    $hasStock = in_array($product->estoque, $this->availabilityFields);
                    $flaggedToReposition = $product?->reposicao === 'Sim';
                    $availability = $hasStock ? AvailabilityType::AVAILABLE : AvailabilityType::UNAVAILABLE;

                    if (!$flaggedToReposition) {
                        $availability = $hasStock ? AvailabilityType::OUTLET : AvailabilityType::OUT_OF_LINE;
                    }

                    $title = ucwords(trim("$product->nome $product->descricao"));
                    $arrayProducts[$product->codigo] = [
                        'title' => $title,
                        'slug' => Str::slug($title),
                        'api_reference' => $product->codigo,
                        'primary_text' => $product->infAdicionais ?? null,
                        'reference' => $product->codigo,
                        'ean13' => trim($product->codigoBarras),
                        'ncm' => trim($product->ncm),
                        'icms' => trim($product->icms),
                        'display_code' => $product->codigoBarrasUnit,
                        'dun14' => $product->codigoBarrasMaster,
                        'cfop' => trim($product->cfop),
                        'ipi' => 0,
                        'cst' => trim($product->cst),
                        'size_height' => $product->altura,
                        'size_width' => $product->largura,
                        'size_length' => $product->comprimento,
                        'size_cubic' => ($product->altura * $product->largura * $product->comprimento),
                        'size_weight' => $product->peso,
                        'unit_price' => $product->preco,
                        'unit_minimal' => 1,
                        'box_price' => $product->preco,
                        'box_minimal' => 1,
                        'unit_subtotal' => $product->preco,
                        'box_subtotal' => $product->preco,
                        'availability' => $availability,
                        'seo_title' => Str::limit(strip_tags($title), 65, null),
                        'supplier_id' => $this->supplier->id,
                        'dataAttProduto' => $product->dataAttProduto,
                        'packaging' => $product->embalagem,
                        'lista' => $product->lista,
                        'marca' => $product->marca,
                        'replacement' => $product->reposicao,
                        'origin' => in_array($product->procedencia, [0, 3, 4, 5, 8])
                            ? OriginType::NATIONAL
                            : (in_array($product->procedencia, [1, 2, 6, 7]) ? OriginType::IMPORTED : null)
                    ];

                    if ($availability == AvailabilityType::OUTLET) {
                        $arrayProducts[$product->codigo]['badge_id'] = 25;
                    }

                    $bar->advance();
                } catch (Exception $e) {
                    dd($e->getMessage(), $e->getLine());
                }
            }

            $this->comment("\n => Produtos formatados com sucesso.\n");

            return [
                'products' => $arrayProducts,
                'not_found_products' => $arrayNotFound
            ];
        });
    }

    protected function firstOrCreateBrand($product)
    {
        $brand = $product->marca;

        $name = ucwords(trim(mb_strtolower($brand)));
        $exists = Brand::where('slug', Str::slug($name))->first();

        if (!$exists) {
            try {
                $exists = Brand::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'api_reference' => null,
                ]);
            } catch (Exception $e) {
                dd("Erro ao gravar marca \"$name\": {$e->getMessage()}", $product);
            }
        }

        return $exists;
    }

    protected function firstOrCreateCategory($product)
    {
        $category = $product->lista;

        $name = ucwords(trim(mb_strtolower($category)));
        $exists = Category::where('slug', Str::slug($name))->first();

        if (!$exists) {
            try {
                $exists = Category::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'order' => (new Category)->getNextOrder($this->supplier->id),
                    'supplier_id' => $this->supplier->id
                ]);
            } catch (Exception $e) {
                dd("Erro ao gravar categoria \"$name\": {$e->getMessage()}", $product);
            }
        }

        return $exists;
    }

    protected function importProductsImages(Product $product): void
    {
        try {
            // Faça a solicitação HTTP para obter as URLs das imagens
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
            ])->acceptJson()->get("$this->apiBaseUrl/imagem/get-all-imagem?produto=$product->api_reference");

            if (!$response->successful()) {
                $this->line("Falha na solicitação da imagem para o produto $product->api_reference");
                return;
            }

            $images = $response->json();
        } catch (Exception $e) {
            $this->line("Erro na importação de imagens: {$e->getMessage()}");
        }

        // Verifique se não há necessidade de sincronização
        if (empty($images) || count($product->images) >= count($images)) {
            $this->line("\nNão há necessidade de sincronização de imagens para o produto $product->id\n");
            return;
        }
        $arrImages = [];

        foreach ($images as $image) {
            try {
                $image = (object) $image;
                // Faça o download da imagem
                $imageBase64 = $image->arquivo;
                $arrImages[] = uploadedFileFromBase64($imageBase64);
            } catch (Exception $e) {
                Log::info("[Reval Import] Erro ao processar imagem da referência $product->api_reference: {$e->getMessage()}");
                $this->line("Erro ao processar imagem: {$e->getMessage()}");
                continue;
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
        } catch (Exception $e) {
            dd($e->getMessage());
        }

        $this->line("\n\nImagens importadas com sucesso para o produto $product->id");
    }

    protected function updateSupplierImportedAtDates(): void
    {
        $supplier = $this->supplier;

        try {
            $supplier->update([
                'last_imported_at' => Carbon::now(),
                'last_but_one_imported_at' => $supplier->last_imported_at
            ]);
        } catch (\Exception $exception) {
            Log::error("Erro ao tentar atualização a data de importação da representada. {$exception->getMessage()}");
        }
    }

    protected function clearProducts(Collection $apiProducts): void
    {
        $query = Product::whereNotIn('reference', $apiProducts->pluck('codigo'))
            ->where('supplier_id', $this->supplier->id)
            ->where('availability', '!=', AvailabilityType::OUT_OF_LINE)
            ->where('replacement', 'Sem Reposição');

        $productsCount = $query->count();
        if ($productsCount) {
            $this->info("$productsCount Produtos ficaram fora de estoque!");
            $query->update(['availability' => AvailabilityType::OUT_OF_LINE]);
            return;
        }

        $this->info("Nenhum Produto ficou fora de estoque!");
    }

    protected function emptyStockProducts(Collection $apiProducts): void
    {
        $query = Product::whereNotIn('reference', $apiProducts->pluck('codigo'))
            ->where('supplier_id', $this->supplier->id)
            ->where('availability', '!=', AvailabilityType::OUT_OF_LINE)
            ->where('replacement', 'sim');

        $productsCount = $query->count();
        if ($productsCount) {
            $this->info("$productsCount Produtos ficaram indisponivel!");
            $query->update(['availability' => AvailabilityType::UNAVAILABLE]);
            return;
        }

        $this->info("Nenhum Produto ficou indisponivel!");
    }
}
