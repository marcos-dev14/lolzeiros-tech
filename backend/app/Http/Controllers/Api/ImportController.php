<?php

namespace App\Http\Controllers\Api;

use App\Enums\Product\AgeType;
use App\Enums\Product\AvailabilityType;
use App\Enums\Product\GenderType;
use App\Enums\Product\ImportReportStatusType;
use App\Enums\Product\OriginType;
use App\Http\Resources\Product\ImportResource;
use App\Models\AttributeCategory;
use App\Models\Badge;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Import;
use App\Models\ImportColumns;
use App\Models\ImportReport;
use App\Models\Product;
use App\Models\Supplier;
use App\Services\GalleryService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;
use PhpOffice\PhpSpreadsheet\IOFactory;

use function App\Helpers\uploadedFileFromUrl;

class ImportController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Import $_model,
        private GalleryService $_galleryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->with('supplier')->latest();

        if ($request->paginated == 'true') {
            $imports = $builder->paginate();

            return $this->sendResponse(
                ImportResource::collection($imports)->response()->getData(),
                'Imports fetched.'
            );
        }

        $imports = $builder->latest()->take(50)->get();

        return $this->sendResponse(ImportResource::collection($imports), 'Imports fetched.');
    }

    public function show($id): JsonResponse
    {
        $import = $this->_model->with('columns', 'reports', 'supplier')->find($id);

        if (is_null($import)) {
            return $this->sendError('Importação não existe', [], 404);
        }

        return $this->sendResponse(new ImportResource($import), 'Importação encontrada');
    }

    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['user_id'] = auth()->user()->id;

        $validator = Validator::make($requestFields, ['name' => 'required|min:4']);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $import = $this->_model->fill($requestFields);
        $import->save();

        return $this->sendResponse(new ImportResource($import), 'Importação adicionado com sucesso.', 201);
    }

    public function update(Request $request, $importId): JsonResponse
    {
        $import = $this->_model->with('reports', 'supplier')->find($importId);

        if (!$import) {
            return $this->sendError('Importação não encontrado', [], 404);
        }

        if (count($import->reports)) {
            return $this->sendError('Esta importação não pode mais ser alterada');
        }

        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['user_id'] = auth()->user()->id;

        $validator = Validator::make($requestFields, [
            'name' => 'min:4',
            'supplier_id' => 'integer|exists:product_suppliers,id,deleted_at,NULL',
            'initial_line' => 'integer',
            'new_register' => 'string|in:yes,no,withdraw'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $import->update($requestFields);
        $import->load('columns', 'supplier');

        return $this->sendResponse(new ImportResource($import), 'Importação atualizado.');
    }

    public function destroy($importId): JsonResponse
    {
        $import = $this->_model->with('reports')->find($importId);

        if (!$import) {
            return $this->sendError('Importação não encontrado', [], 404);
        }

        if (count($import->reports)) {
            return $this->sendError('Esta importação não pode ser removida');
        }

        $import->delete();

        return $this->sendResponse([], 'Importação removida');
    }

    public function rollback($importId): JsonResponse
    {
        $import = $this->_model->with('reports', 'supplier')->find($importId);

        if (!$import) {
            return $this->sendError('Importação não encontrada', [], 404);
        }

        if ($import->new_register != 'yes') {
            return $this->sendError('Somente importações de inserção podem ser canceladas.', [], 400);
        }

        $reports = $import->reports;

        if (!count($reports)) {
            return $this->sendError('Esta importação ainda não foi executada.', [], 400);
        }

        $initialDatetime = $reports->min('created_at')->addMinutes('-10');
        $finishDatetime = $reports->max('created_at')->addMinutes('10');

        $supplierId = $import->supplier_id;

        $references = $import->reports->pluck('product_reference');

        $products = Product::with('category', 'brand')
            ->whereIn('reference', $references)
            ->where('supplier_id', $supplierId)
            ->get();

        $brandIds = $products->pluck('brand_id')->unique();
        $categoryIds = $products->pluck('category_id')->unique();

        ImportReport::whereIn('id', $reports->pluck('id'))->delete();

        $products->each(fn ($product) => $product->delete());

        $brands = Brand::whereIn('id', $brandIds)
            ->whereBetween('created_at', [$initialDatetime, $finishDatetime])
            ->doesntHave('products')
            ->get();

        $categories = Category::whereIn('id', $categoryIds)
            ->whereBetween('created_at', [$initialDatetime, $finishDatetime])
            ->doesntHave('products')
            ->get();

        if ($categories) {
            Category::whereIn('id', $categories->pluck('id'))->delete();
        }

        if ($brands) {
            Brand::whereIn('id', $brands->pluck('id'))->delete();
        }

        $supplier = $import->supplier;
        $supplier->update([
            'last_imported_at' => $supplier->last_but_one_imported_at,
            'last_but_one_imported_at' => null
        ]);

        return $this->sendResponse([], 'Importação revertida com sucesso.');
    }

    public function upload(Request $request, $importId): JsonResponse
    {
        $import = $this->_model->with('columns', 'reports', 'supplier')->find($importId);

        if (is_null($import)) {
            return $this->sendError('Importação não existe', [], 404);
        }

        if (count($import->reports)) {
            return $this->sendError('Não é possível fazer upload para esta importação, crie uma nova importação');
        }

        if (!count($import->columns)) {
            return $this->sendError('Adicione pelo menos uma coluna para continuar');
        }

        if (empty($import->supplier)) {
            return $this->sendError('A importação deve estar vinculada a uma representada');
        }

        $validator = Validator::make(['uploaded_file' => $request->file('file')], [
            'uploaded_file' => 'required|file|mimes:xls,xlsx'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $file = $request->file('file');

        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rowLimit = $sheet->getHighestDataRow();
        $rowRange = range($import->initial_line, $rowLimit);
        //$columnRange = range('A', $columnLimit);
        //$columnLimit = $sheet->getHighestDataColumn();

        $data = [];
        $columns = $import->columns;

        try {
            foreach ($rowRange as $row) {
                $temp = ['info' => [$row]];
                $emptyFields = 0;

                foreach ($columns as $column) {
                    $cell = $sheet->getCell("$column->column$row");
                    $calculatedValue = $cell->getCalculatedValue();
                    $type = gettype($calculatedValue);
                    $calculatedValue = trim(preg_replace('/\s+/', ' ', $calculatedValue));
                    settype($calculatedValue, $type);

                    $temp[$column->field_name] = $calculatedValue;

                    if (empty($temp[$column->field_name]) && $temp[$column->field_name] !== 0) {
                        $emptyFields++;
                    }
                }

                if ($emptyFields < count($columns)) {
                    $data[] = $temp;
                }
            }

            $data = $this->validateImportedData($import, $data, $columns);
            $this->canProcessImport($import);
            $this->processImport($import, $data);
            $this->updateSupplierImportedAtDates($import);
            $this->importImagesFromFtp($import);
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), []);
        }

        $import->load('reports');

        return $this->sendResponse(new ImportResource($import), 'Produtos importados com sucesso.', 201);
    }

    protected function updateSupplierImportedAtDates($import)
    {
        $supplier = $import->supplier;

        if (empty($supplier)) {
            return;
        }

        try {
            $supplier->update([
                'last_imported_at' => Carbon::now(),
                'last_but_one_imported_at' => $supplier->last_imported_at
            ]);
        } catch (\Exception $exception) {
            Log::error("Erro ao tentar atualização a data de importação da representada. {$exception->getMessage()}");
        }
    }

    /**
     * @throws Exception
     */
    protected function importImagesFromFtp(Import $import)
    {
        $import->load('reports');
        $reports = $import->reports;

        foreach ($reports as $report) {
            $reportProduct = $report->product;

            if (!$reportProduct) {
                continue;
            }

            $reference = $reportProduct->reference;
            $product = Product::where('supplier_id', $import->supplier_id)->where('reference', $reference)->first();

            $path = 'app/public/upload_ftp';

            $matchingFiles = File::glob(storage_path("$path/{$reference}_*.*"));
            $uploadedFiles = [];

            if (!$matchingFiles) {
                continue;
            }

            foreach ($matchingFiles as $file) {
                try {
                    $fileName = explode('/', $file);
                    $fileName = array_pop($fileName);

                    $uploadedFiles[] = uploadedFileFromUrl($file, $fileName);
                } catch (\Exception $e) {
                    dd(228, $e->getMessage());
                }
            }

            if (!$uploadedFiles) {
                continue;
            }

            $destinationPath = str_replace('{id}', $product->id, Product::IMAGEABLE_PATH);
            try {
                $product->loadMissing('images');

                // percorre todas as imagens, verifica se possui o sufixo _1 no nome e
                // registra ela como principal
                foreach ($uploadedFiles as $key => $uploadedFile) {
                    if (str_contains($uploadedFile->getClientOriginalName(), '_1.')) {
                        $mainUploadedFile = $uploadedFile;
                        unset($uploadedFiles[$key]);

                        $this->_galleryService->storeMain(
                            imageableInstance: $product,
                            file: $mainUploadedFile,
                            path: $destinationPath,
                            dimensions: '1200x1200',
                            name: "$product->title-$product->reference"
                        );
                    }
                }

                $product->load('images');
                $mainImage = $product->images?->where('main', 1);
                if (!(!empty($mainImage) && $mainImage->count())) {
                    $firstUploadedFile = array_shift($uploadedFiles);
                    $this->_galleryService->storeMain(
                        imageableInstance: $product,
                        file: $firstUploadedFile,
                        path: $destinationPath,
                        dimensions: '1200x1200',
                        name: "$product->title-$product->reference"
                    );
                }

                if (count($uploadedFiles)) {
                    $this->_galleryService->store(
                        imageableInstance: $product,
                        files: $uploadedFiles,
                        path: $destinationPath,
                        dimensions: '1200x1200',
                        name: "$product->title-$product->reference"
                    );
                }

                foreach ($matchingFiles as $file) {
                    $file = str_replace(storage_path('app/public'), '', $file);

                    if (Storage::exists($file)) {
                        Storage::delete($file);
                    }
                }
            } catch (\Exception $e) {
                throw new Exception($e->getMessage(), 500);
            }
        }
    }

    /**
     * @throws Exception
     */
    protected function canProcessImport($import)
    {
        $columns = $import->columns;
        $updateMandatoryColumns = ['reference'];
        $insertMandatoryColumns = ['reference', 'title', 'category'];
        $mandatoryColumns = $import->new_register == 'yes' ? $insertMandatoryColumns : $updateMandatoryColumns;

        foreach ($mandatoryColumns as $column) {
            if (!$columns->where('field_name', $column)->count()) {
                $columnName = ImportColumns::AVAILABLE_COLUMNS[$column];
                throw new Exception("Adicione a coluna '$columnName' para continuar");
            }
        }
    }

    protected function validateImportedData(Model $import, array $data, Collection $columns): array
    {
        $newData = [];
        $columnIdx = 0;

        foreach ($data as $idx => $product) {
            $newData[$idx]['supplier_id'] = $import->supplier_id;
            $line = array_shift($product)[0];

            foreach ($product as $key => $value) {
                $newData[$idx]['info']['line'] = $line;

                if ($key == 'reference') {
                    $value = "$value";
                }

                if ($value == '-') {
                    $newData[$idx][$key] = null;

                    continue;
                } elseif (empty($value) && $value !== 0 && $value !== 0.0) {
                    $newData[$idx]['info'] = $this->addErrorMessage(
                        $newData[$idx]['info'],
                        $columns,
                        $key,
                        'O campo {key} não pode estar vazio.'
                    );

                    continue;
                }

                if ($key == 'category') {
                    $category = Category::where('slug', Str::slug($value))->where('supplier_id', $import->supplier_id)->first()
                        ?? $this->createCategory($value, $import->supplier_id);
                    $newData[$idx]['category_id'] = $category->id;

                    continue;
                }

                if ($key == 'brand') {
                    $brand = Brand::where('slug', Str::slug($value))->first() ?? $this->createBrand($value);
                    $newData[$idx]['brand_id'] = $brand->id;

                    continue;
                }

                if ($key == 'badge') {
                    $badge = Badge::where('name', $value)->first();

                    if($badge instanceof Badge) {
                        $newData[$idx]['badge_id'] = $badge->id;
                    }

                    continue;
                }

                if ($key == 'origin') {
                    $value = ucfirst(mb_strtolower($value));
                    $originTypes = OriginType::asArray();
                    $newData[$idx][$key] = $value;

                    if (!in_array($value, $originTypes)) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            'O campo {key} deve ser um dos valores: ' . implode(', ', $originTypes)
                        );
                    }

                    continue;
                }

                if ($key == 'availability') {
                    $value = ucfirst(mb_strtolower($value));
                    $availabilityTypes = AvailabilityType::asArray();
                    $newData[$idx][$key] = $value;

                    if (!in_array($value, $availabilityTypes)) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            'O campo {key} deve ser um dos valores: ' . implode(', ', $availabilityTypes)
                        );
                    }

                    continue;
                }

                if ($key == 'gender') {
                    $value = ucfirst(mb_strtolower($value));
                    $genderTypes = GenderType::asArray();
                    $newData[$idx][$key] = $value;

                    if (!in_array($value, $genderTypes)) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            'O campo {key} deve ser um dos valores: ' . implode(', ', $genderTypes)
                        );
                    }

                    continue;
                }

                if ($key == 'age_group') {
                    $value = mb_strtolower($value);
                    $ageTypes = AgeType::asArray();
                    $newData[$idx][$key] = $value;

                    if (!in_array($value, $ageTypes)) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            'O campo {key} deve ser um dos valores: ' . implode(', ', $ageTypes)
                        );
                    }

                    continue;
                }

                if ($key == 'release_year') {
                    $value = intval($value);
                    $minValue = 2010;
                    $maxValue = 2030;
                    $newData[$idx][$key] = ($value >= $minValue && $value <= $maxValue) ? $value : null;

                    if ($value < $minValue || $value > $maxValue) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            "O campo {key} deve ser um dos valor entre $minValue e $maxValue"
                        );
                    }

                    continue;
                }

                if ($key == 'icms' || $key == 'ipi' || $key == 'cst') {
                    $value = floatval($value);
                    $minValue = 0;
                    $maxValue = 100;
                    $newData[$idx][$key] = $value ?? null;

                    if ($value < $minValue || $value > $maxValue) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            "O campo {key} deve ser um dos valor entre $minValue e $maxValue"
                        );
                    }

                    continue;
                }

                if ($key == 'title') {
                    $newData[$idx]['title'] = ucwords(mb_strtolower($value));
                    $newData[$idx]['slug'] = Str::slug($value);

                    if (!isset($product['seo_title'])) {
                        $newData[$idx]['seo_title'] = substr(ucwords(mb_strtolower($value)), 0, 65);
                    }

                    continue;
                }

                if ($key == 'seo_title') {
                    $newData[$idx][$key] = substr(ucwords(mb_strtolower($value)), 0, 65);

                    continue;
                }

                if ($key == 'seo_description') {
                    $newData[$idx][$key] = substr(ucwords(mb_strtolower($value)), 0, 191);

                    continue;
                }

                if ($key == 'searcheable') {
                    $newData[$idx][$key] = mb_strtolower($value);

                    continue;
                }

                if ($key == 'box_weight' || $key == 'size_weight') {
                    $newData[$idx][$key] = floatval(str_replace(',', '.', $value));

                    continue;
                }

                if ($key == 'expiration_date' || $key == 'expected_arrival') {
                    $value = intval($value);
                    $unixDate = ($value - 25569) * 86400;

                    try {
                        $newData[$idx][$key] = Carbon::parse($unixDate) ?? null;
                    } catch (\Exception $e) {
                        $newData[$idx]['info'] = $this->addErrorMessage(
                            $newData[$idx]['info'],
                            $columns,
                            $key,
                            'O campo {key} deve conter uma data válida'
                        );
                    }

                    continue;
                }

                $newData[$idx][$key] = $value;

                $columnIdx = $columnIdx >= (count($product) - 1) ? $columnIdx + 1 : 0;
            }
        }

        return $newData;
    }

    protected function addErrorMessage(array $arrayInfo, Collection $columns, $key, string $message): array
    {
        $column = $columns->firstWhere('field_name', $key);
        $keyLabel = $column::AVAILABLE_COLUMNS[$key];

        $arrayInfo['column_reference'] = $column->column;
        $arrayInfo['column_name'] = $column->field_name;
        $arrayInfo['message'] = str_replace('{key}', $keyLabel, $message);
        $arrayInfo['status'] = ImportReportStatusType::ERROR();

        return $arrayInfo;
    }

    protected function createCategory($name, $supplierId)
    {
        $supplier = Supplier::find($supplierId);
        $lastOrder = $supplier->categories->pluck('order')->max();

        return Category::create([
            'name' => ucfirst(mb_strtolower($name)),
            'slug' => Str::slug($name),
            'order' => $lastOrder + 1,
            'supplier_id' => $supplierId
        ]);
    }

    protected function createBrand($name)
    {
        return Brand::create([
            'name' => ucfirst(mb_strtolower($name)),
            'slug' => Str::slug($name)
        ]);
    }

    protected function processImport(Model $import, $data)
    {
        $newRegister = $import->new_register;

        if ($newRegister == 'withdraw') {
            Product::where('supplier_id', $import->supplier_id)
                ->where('availability', '!=', AvailabilityType::OUT_OF_LINE)
                ->update(['availability' => AvailabilityType::UNAVAILABLE]);
        }

        foreach ($data as $item) {
            if (!empty($item['info']['status']) && $item['info']['status'] == ImportReportStatusType::ERROR()) {
                $this->dispatchReport($import, $item['info'], $item['reference']);

                continue;
            }

            if ($newRegister == 'withdraw') {
                $item['availability'] = AvailabilityType::AVAILABLE;
            }

            $productData = collect($item);
            $productData = $productData->only((new Product())->getFillable())?->toArray();

            $validator = Validator::make($productData, (new Product)->validationRules);
            if ($validator->fails()) {
                $item['info']['message'] = $validator->errors()->first();
                $this->dispatchReport($import, $item['info'], $item['reference']);

                continue;
            }

            try {
                $product = Product::where('supplier_id', $item['supplier_id'])
                    ->where('reference', $item['reference'])
                    ->first();

                if ($newRegister == 'yes') {
                    if ($product instanceof Product) {
                        $item['info']['message'] = 'A referência informada já existe';
                        $this->dispatchReport($import, $item['info'], $item['reference']);

                        continue;
                    }

                    $product = Product::create($productData);
                } else {
                    if (!$product instanceof Product) {
                        continue;
                    }

                    $product->update($productData);
                }

                if (isset($item['embed_product'])) {
                    $this->processEmbedProduct($product, $item['embed_product']);
                }

                if (isset($item['product_variations'])) {
                    $this->processProductVariations($product, $item['product_variations']);
                }

                if (isset($item['product_related'])) {
                    $this->processRelatedProducts($product, $item['product_related']);
                }

                if (isset($item['product_attributes'])) {
                    $this->processAttributes($product, $item['product_attributes']);
                }

                $this->dispatchReport($import, $item['info'], $item['reference'], ImportReportStatusType::SUCCESS());
            } catch (Exception $e) {
                $item['info']['message'] = "{$e->getMessage()} - Line {$e->getLine()}";
                $this->dispatchReport($import, $item['info'], $item['reference']);
            }
        }
    }

    private function processEmbedProduct(Product $product, ?string $embedData)
    {
        if (empty($embedData)) {
            $product->update(['embed_type' => null, 'embed_id' => null]);

            return;
        }

        if ($embedData === $product->reference) {
            return;
        }

        $embedProduct = Product::select(['id', 'supplier_id'])
            ->where('supplier_id', $product->supplier_id)
            ->where('reference', $embedData)
            ->first();

        if (!$embedProduct) {
            return;
        }

        $product->update(['embed_type' => $product::class, 'embed_id' => $embedProduct->id]);
    }

    private function processProductVariations(Product $product, ?string $variations)
    {
        if (empty($variations)) {
            $product->variations()->detach();

            return;
        }

        $arrayVariations = explode(',', str_replace(' ', '', $variations));

        if (!count($arrayVariations)) {
            return;
        }

        foreach ($arrayVariations as $variation) {
            if ($variation == $product->reference) {
                continue;
            }

            $attachProduct = Product::select('id', 'supplier_id')
                ->where('supplier_id', $product->supplier_id)
                ->where('reference', $variation)
                ->first();

            $productVariations = $product->variations;

            if (!$product || $productVariations->contains('id', $attachProduct->id)) {
                continue;
            }

            $product->variations()->attach($attachProduct);
        }
    }

    private function processRelatedProducts(Product $product, ?string $relatedProducts)
    {
        if (empty($relatedProducts)) {
            $product->related()->detach();

            return;
        }

        $arrayRelatedProducts = explode(',', str_replace(' ', '', $relatedProducts));

        if (!count($arrayRelatedProducts)) {
            return;
        }

        foreach ($arrayRelatedProducts as $related) {
            if ($related == $product->reference) {
                continue;
            }

            $attachProduct = Product::select('id', 'supplier_id')
                ->where('supplier_id', $product->supplier_id)
                ->where('reference', $related)
                ->first();

            $currentRelated = $product->related;

            if (!$product || !$attachProduct || $currentRelated->contains('id', $attachProduct->id)) {
                continue;
            }

            $product->related()->syncWithoutDetaching($attachProduct);
        }
    }

    private function processAttributes(Product $product, ?string $stringData)
    {
        if (empty($stringData)) {
            $product->pAttributes()->detach();
            $product->update(['attribute_category_id' => null]);

            return;
        }

        if (!str_contains($stringData, ':') || !str_contains($stringData, '(') || !str_contains($stringData, '/')) {
            return;
        }

        [$attributeCategoryName, $attributeData] = explode(': ', $stringData);
        $arrayAttributes = explode('), (', trim($attributeData, '()'));

        $arrayFormattedAttributes = [];
        foreach ($arrayAttributes as $item) {
            [$attributeName, $attributeValues] = explode('/', $item);
            $explodedAttributeValues = explode(',', str_replace(', ', ',', $attributeValues));

            $arrayFormattedAttributes[] = [
                'name' => $attributeName,
                'values' => $explodedAttributeValues
            ];
        }

        $storedAttributeCategory = AttributeCategory::with('attributes')->firstOrCreate(['name' => $attributeCategoryName]);

        foreach ($arrayFormattedAttributes as $formattedAttribute) {
            $nextOrder = $storedAttributeCategory->attributes()->latest()->pluck('order')->first() + 1;
            $storedAttribute = $storedAttributeCategory->attributes()->firstOrCreate(
                [
                    'name' => $formattedAttribute['name'],
                    'attribute_category_id' => $storedAttributeCategory->id
                ],
                ['order' => $nextOrder]
            );

            foreach ($formattedAttribute['values'] as $value) {
                if (!str_contains($storedAttribute->values, $value)) {
                    $values = $storedAttribute->values ? "{$storedAttribute->values},$value" : $value;
                    $storedAttribute->update(['values' => $values]);
                }
            }
        }

        Product::withoutEvents(function () use ($storedAttributeCategory, $product) {
            $product->update(['attribute_category_id' => $storedAttributeCategory->id]);
        });
        $product->load('pAttributes');

        $product->pAttributes()->detach();
        $product->pAttributes()->sync(
            $storedAttributeCategory->attributes
                ->whereIn('name', collect($arrayFormattedAttributes)->pluck('name'))
                ->pluck('id')
                ->mapWithKeys(function ($attributeId, $index) use ($arrayFormattedAttributes) {
                    $attribute = $arrayFormattedAttributes[$index];
                    $value = implode(',', $attribute['values']);

                    return [$attributeId => ['order' => $index + 1, 'value' => $value]];
                })
        );

        $product->load('validAttrs', 'pAttributes');
    }

    protected function dispatchReport(Model $import, array $data, $productReference, $status = ImportReportStatusType::ERROR)
    {
        ImportReport::create([
            'import_id' => $import->id,
            'line' => $data['line'],
            'column_reference' => $data['column_reference'] ?? 'Todos',
            'column_name' => $data['column_name'] ?? 'Todos',
            'product_reference' => $productReference ?? null,
            'status' => $status,
            'message' => $data['message'] ?? null
        ]);
    }

    public function copy($importId): JsonResponse
    {
        $import = $this->_model->with('columns')->find($importId);

        if (is_null($import)) {
            return $this->sendError('Importação não existe', [], 404);
        }

        $newImportData = collect($import->toArray())->only($this->_model->getFillable());

        $now = Carbon::now();
        $oldName = $newImportData['name'];
        $oldName = explode(' | ', $oldName);
        $newImportData['name'] = "$oldName[0] | {$now->format('dmHis')}";

        $newImport = $this->_model->create($newImportData->toArray());
        $newImport->save();

        $columns = $import->columns;
        if ($columns) {
            foreach ($columns as $column) {
                $newColumnData = collect($column->toArray())->only((new ImportColumns())->getFillable());
                $newColumnData['import_id'] = $newImport->id;
                ImportColumns::create($newColumnData->toArray());
            }
        }

        $newImport->loadMissing('columns');

        return $this->sendResponse(new ImportResource($newImport), 'Importação duplicada com sucesso.');
    }
}
