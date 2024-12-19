<?php

namespace App\Http\Controllers\Frontend;

use App\Models\BlogPost;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSearchHistory;
use App\Models\Supplier;
use App\Models\Client;
use App\Models\Order;

use App\Services\ClientSessionManager;

use Carbon\Carbon;

use Illuminate\Database\Eloquent\Builder;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Illuminate\View\View;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use JetBrains\PhpStorm\NoReturn;

class ProductController extends BaseController
{
    protected string|null $baseCacheKey;
    protected array $availableSorts = [
        'random' => 'Ordem Aleatória',
        'price-asc' => 'Menor Preço',
        'price-desc' => 'Maior Preço',
        'slug-asc' => 'Nome A-Z',
        'slug-desc' => 'Nome Z-A',
        'reference-asc' => 'Referência A-Z',
        'reference-desc' => 'Referência Z-A',
        'catalog_page-asc' => 'Catálogo A-Z',
        'catalog_page-desc' => 'Catálogo Z-A',
        'release-desc' => 'Lançamentos',
    ];

    #[NoReturn]
    public function __construct(protected ClientSessionManager $sessionManager)
    {
        parent::__construct();

        $this->setPageSeo((object)[
            'title' => 'Produtos'
        ]);
    }

    protected function getClient(): ?Client
    {
        return $this->sessionManager->getSessionSelectedClient();
    }

    public function index(Request $request): View|JsonResponse
    {
        $supplierId = (int)$request->rp;
        $searchTerms = $request->pe ?? null;
        $categoryIds = json_decode($request->ca ?? '[]');
        $brandIds = json_decode($request->ma ?? '[]');
        $attributeIds = json_decode($request->attr ?? '[]');
        $selectedSort = $request->or ?? 'random';

        $this->baseCacheKey = "$request->rp-$request->pe-$request->ca-$request->ma-$request->attr";

        $supplier = Supplier::find($supplierId);

        $productsBuilder = $this->getProductsBuilder(
            supplier: $supplier,
            searchTerms: $searchTerms,
            sortBy: $selectedSort,
            categories: $categoryIds,
            brands: $brandIds,
            attributes: $attributeIds,
            unpublished: (bool)$request?->nao_publicado == '1'
        );

        if ($request->ajax()) {
            $products = $productsBuilder->take(8)->get();
            $renderedProducts = '';

            foreach ($products as $product) {
                $renderedProducts .= view('components._card', ['product' => $product])->render();
            }

            return response()->json($renderedProducts);
        }

        $categories = $supplier ? $this->getSupplierCategoriesByBrands($supplier, $brandIds, $categoryIds) : null;
        $brands = ($supplier || $brandIds) ? $this->getSupplierBrands($supplier, $categoryIds, $brandIds) : null;
        $attributes = ($supplier && $categoryIds) ? $this->getAttributes($productsBuilder, $attributeIds) : null;
        $availableSorts = collect($this->availableSorts);
        $suppliers = $this->getSuppliers($supplierId);

        session(['filters.suppliers.selected' => $supplier?->id]);
        session(['filters.searchTerms' => $searchTerms]);
        session(['filters.selectedSort' => $selectedSort]);
        session(['filter.supplier' => $supplierId]);
        session(['filter.categories' => $categoryIds]);
        session(['filter.brands' => $brandIds]);

        $products = $productsBuilder->paginate(48)->onEachSide(1)->withQueryString();

        return view('pages.products', compact(
            'supplier',
            'brands',
            'attributes',
            'categories',
            'suppliers',
            'products',
            'availableSorts',
        ));
    }

    public function saveSearchTerm(Request $request)
    {
        $searchTerm = $request->input('term');

        if (!empty($searchTerm)) {
            $sanitizedTerm = $this->processSearchTermsHistory($searchTerm);

            $buyer = auth()->guard('buyer')->user();

            $existingRecord = ProductSearchHistory::where('buyer_id', $buyer->id ?? null)
                ->where('term_search', $sanitizedTerm)
                ->exists();

            if (!$existingRecord) {

                $client = $this->getClient();

                ProductSearchHistory::create([
                    'term_search' => $sanitizedTerm,
                    'searched_at' => now(),
                    'buyer_id' => $buyer->id ?? null,
                    'buyer_name' => $buyer->name ?? null,
                    'buyer_email' => $buyer->email ?? null,
                    'role_id' => $buyer->role_id ?? null,
                    'role_name' => $buyer->role_name ?? null,
                    'company_name' => $client->company_name ?? null,
                    'name' => $client->name ?? null,
                    'document' => $client->document ?? null,
                    'document_status' => $client->document_status ?? null,
                    'joint_stock' => isset($client->joint_stock) ? (float)preg_replace('/[^\d.]/', '', str_replace(',', '.', $client->joint_stock)) : null,
                    'client_group_id' => $client->client_group_id ?? null,
                    'client_profile_id' => $client->client_profile_id ?? null,
                    'tax_regime_id' => $client->tax_regime_id ?? null,
                    'client_pdv_id' => $client->client_pdv_id ?? null,
                    'seller_id' => $client->seller_id ?? null,
                    'lead_time_id' => $client->lead_time_id ?? null,
                    'client_origin_id' => $client->client_origin_id ?? null,
                ]);
            }
        }
    }

    protected function processSearchTermsHistory(string $searchTerms): string
    {
        return collect(preg_split('/\s+/', trim($searchTerms)))
            ->filter(fn($term) => strlen($term) > 1)
            ->map(fn($term) => preg_replace('/[^\p{L}\p{N}]+/u', '', strtolower($term)))
            ->implode(' ');
    }

    public function suggestions(Request $request): JsonResponse
    {
        $term = $request->input('pe');

        if (strlen($term) < 3) {
            return response()->json(['suggestions' => [], 'popular' => []]);
        }

        $searchTerm = $this->processSearchTermsHistory($term);

        $recent = ProductSearchHistory::recent($searchTerm)
            ->get()
            ->map(fn($item) => ucwords(strtolower($item->term_search)));

        $popular = Order::query()
            ->join('order_statuses', 'orders.id', '=', 'order_statuses.order_id')
            ->join('order_products', 'order_products.order_id', '=', 'orders.id')
            ->where('orders.created_at', '>=', now()->subMonths(6))
            ->when(!empty($searchTerm), function ($query) use ($searchTerm) {
                $query->where('order_products.title', 'like', '%' . $searchTerm . '%');
            })
            ->select([
                'order_products.title',
                'order_products.reference',
                DB::raw('COUNT(DISTINCT orders.id) AS total_orders'),
            ])
            ->groupBy('order_products.title', 'order_products.reference')
            ->orderByDesc('total_orders')
            ->limit(10)
            ->get()
            ->map(fn($item) => [
                'title' => ucwords($item->title),
                'reference' => $item->reference,
            ]);

        return response()->json([
            'suggestions' => $recent,
            'popular' => $popular,
        ]);
    }

    protected function getProductsBuilder(
        ?Supplier $supplier,
        ?string $searchTerms,
        ?string $sortBy = 'random',
        array $categories = [],
        ?array $brands = [],
        ?array $attributes = [],
        bool $unpublished = true
    ): Builder {

        $badgeOrder = [43, 19, 21, 39, 30, 25, 38, 45, 46];
        $availabilityOrder = ['Disponível', 'Outlet', 'Pré-venda', 'Indisponível', 'Fora de linha', 'Em cadastro'];

        $client = $this->getClient();

        if (empty($sortBy) || $sortBy == 'random') {

            if ($client) {
                $priorityQuery = $this->getProductsPriorityBuilder(
                    $supplier,
                    $searchTerms,
                    $categories,
                    $brands,
                    $attributes,
                    $unpublished
                    )
                    ->addSelect( DB::raw('1 as type_order'));
            }

        $completeMatchQuery = $this->getCompleteMatchBuilder(
            $supplier,
            $searchTerms,
            $categories,
            $brands,
            $attributes,
            $unpublished
            )
            ->addSelect(DB::raw('2 as type_order'));

            if ($client) {
                $completeMatchQuery->whereNotIn('id', function ($query) use ($priorityQuery) {
                        $query->select('id')->fromSub($priorityQuery, 'priority_matches');
                });
            }
        }

        $partialMatchQuery = $this->getPartialMatchBuilder(
            $supplier,
            $searchTerms,
            $categories,
            $brands,
            $attributes,
            $unpublished
        )
        ->addSelect(DB::raw('3 as type_order'));

        if (empty($sortBy) || $sortBy == 'random') {

            if ($client) {
                $partialMatchQuery->whereNotIn('id', function ($query) use ($priorityQuery) {
                    $query->select('id')->fromSub($priorityQuery, 'priority_matches');
                });
            }

            $partialMatchQuery->whereNotIn('id', function ($query) use ($completeMatchQuery) {
                $query->select('id')->fromSub($completeMatchQuery, 'complete_matches');
            });
        }

        $badgeIsNullQuery = $this->getBadgeIsNullBuilder(
            $supplier,
            $searchTerms,
            $categories,
            $brands,
            $attributes,
            $unpublished
        )
        ->addSelect(DB::raw('4 as type_order'));

        if (empty($sortBy) || $sortBy == 'random') {

            if ($client) {
                $badgeIsNullQuery->whereNotIn('id', function ($query) use ($priorityQuery) {
                    $query->select('id')->fromSub($priorityQuery, 'priority_matches');
                });
            }

            $badgeIsNullQuery->whereNotIn('id', function ($query) use ($completeMatchQuery) {
                $query->select('id')->fromSub($completeMatchQuery, 'complete_matches');
            })
            ->whereNotIn('id', function ($query) use ($partialMatchQuery) {
                $query->select('id')->fromSub($partialMatchQuery, 'partial_matches');
            });

        } else {
            $badgeIsNullQuery->whereNotIn('id', function ($query) use ($partialMatchQuery) {
                $query->select('id')->fromSub($partialMatchQuery, 'partial_matches');
            });
        }

        if (empty($sortBy) || $sortBy == 'random') {

            if ($client) {

                $combinedQuery = $priorityQuery
                    ->unionAll($completeMatchQuery)
                    ->unionAll($partialMatchQuery)
                    ->unionAll($badgeIsNullQuery);

            } else {

                $combinedQuery = $completeMatchQuery
                ->unionAll($partialMatchQuery)
                ->unionAll($badgeIsNullQuery);
            }

        } else {
            $combinedQuery = $partialMatchQuery->unionAll($badgeIsNullQuery);
        }

        $query = Product::query()
            ->fromSub($combinedQuery, 'products')
            ->orderBy('type_order', 'ASC');

        if (empty($sortBy) || $sortBy == 'random') {
            $query->orderByRaw($this->buildOrderCase('badge_id', $badgeOrder) . " ASC")
            ->orderByRaw($this->buildOrderCase('availability', $availabilityOrder) . " ASC");
        }

        [$sortByField, $sortByOrder] = $this->extractSortBy($sortBy);

        return match ($sortByField) {
            'random' => $query,
            'reference' => $query->orderByRaw("CAST(reference as SIGNED INTEGER) {$sortByOrder}"),
            'release' => $query->orderBy('release_year', $sortByOrder),
            'price' => $query->orderByRaw("
                COALESCE(box_price_promotional, box_price) {$sortByOrder}
            "),
            'slug' => $query->orderBy('slug', $sortByOrder),
            'catalog_name' => $query->orderBy('catalog_name', $sortByOrder),
            default => $query->orderBy($sortByField, $sortByOrder),
        };
    }

    protected function getProductsPriorityBuilder(
        ?Supplier $supplier,
        ?string $searchTerms,
        array $categories,
        ?array $brands,
        ?array $attributes,
        bool $unpublished
    ): Builder {
        $query = $this->getClient()
            ->wishlistProducts()
            ->getQuery()
            ->with('supplier', 'brand', 'pAttributes', 'badge', 'route', 'images', 'coupons', 'category')
            ->select([
                'id', 'slug', 'title', 'inner_code', 'reference', 'supplier_id', 'unit_price',
                'unit_price_promotional', 'unit_minimal', 'box_price', 'box_price_promotional',
                'box_minimal', 'dun14', 'ean13', 'icms', 'ipi', 'release_year', 'ncm', 'catalog_name',
                'catalog_page', 'origin', 'box_packing_type', 'category_id', 'brand_id', 'packaging',
                'badge_id', 'availability', 'expected_arrival', 'deleted_at'
            ])
            ->whereNotIn('availability', ['Indisponível', 'Fora de linha', 'Em cadastro'])
            ->when($unpublished, fn($query) => $query->whereNot(fn($q) => $q->published()))
            ->when(!$unpublished, fn($query) => $query->published())
            ->whereHas('supplier', function ($query) {
                $query->where('is_available', 1);
            });

        if (!empty($searchTerms)) {
            $sanitizedTerm = $this->processSearchTerms($searchTerms)->join(' ');

            $query->where(function ($q) use ($sanitizedTerm) {
                $q->orWhereRaw("LOWER(title) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("LOWER(searcheable) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("ean13 = ?", [$sanitizedTerm])
                ->orWhereRaw("reference = ?", [$sanitizedTerm]);
            });
        }

        $this->applyAdditionalFilters($query, $supplier, $brands, $categories, $attributes);

        return $query;
    }

    protected function getCompleteMatchBuilder(
        ?Supplier $supplier,
        ?string $searchTerms,
        array $categories,
        ?array $brands,
        ?array $attributes,
        bool $unpublished
    ): Builder {
        $query = Product::query()
            ->with('supplier', 'brand', 'pAttributes', 'badge', 'route', 'images', 'coupons', 'category')
            ->select([
                'id', 'slug', 'title', 'inner_code', 'reference', 'supplier_id', 'unit_price',
                'unit_price_promotional', 'unit_minimal', 'box_price', 'box_price_promotional',
                'box_minimal', 'dun14', 'ean13', 'icms', 'ipi', 'release_year', 'ncm', 'catalog_name',
                'catalog_page', 'origin', 'box_packing_type', 'category_id', 'brand_id', 'packaging',
                'badge_id', 'availability', 'expected_arrival', 'deleted_at'
            ])
            ->whereNotIn('availability', ['Indisponível', 'Fora de linha', 'Em cadastro'])
            ->when($unpublished, fn($query) => $query->whereNot(fn($q) => $q->published()))
            ->when(!$unpublished, fn($query) => $query->published())
            ->whereHas('supplier', function ($query) {
                $query->where('is_available', 1);
            });

        if (!empty($searchTerms)) {
            $sanitizedTerm = $this->processSearchTerms($searchTerms)->join(' ');

            $query->where(function ($q) use ($sanitizedTerm) {
                $q->orWhereRaw("LOWER(title) = ?", [strtolower($sanitizedTerm)])
                ->orWhereRaw("LOWER(title) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("LOWER(searcheable) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("ean13 = ?", [$sanitizedTerm])
                ->orWhereRaw("reference = ?", [$sanitizedTerm]);
            });
        }

        $this->applyAdditionalFilters($query, $supplier, $brands, $categories, $attributes);

        return $query;
    }

    protected function getPartialMatchBuilder(
        ?Supplier $supplier,
        ?string $searchTerms,
        array $categories,
        ?array $brands,
        ?array $attributes,
        bool $unpublished
    ): Builder {
        $query = Product::query()
            ->with('supplier', 'brand', 'pAttributes', 'badge', 'route', 'images', 'coupons', 'category')
            ->select([
                'id', 'slug', 'title', 'inner_code', 'reference', 'supplier_id', 'unit_price',
                'unit_price_promotional', 'unit_minimal', 'box_price', 'box_price_promotional',
                'box_minimal', 'dun14', 'ean13', 'icms', 'ipi', 'release_year', 'ncm', 'catalog_name',
                'catalog_page', 'origin', 'box_packing_type', 'category_id', 'brand_id', 'packaging',
                'badge_id', 'availability', 'expected_arrival', 'deleted_at'
            ])
            ->whereNotNull('badge_id')
            ->whereNotIn('availability', ['Indisponível', 'Fora de linha', 'Em cadastro'])
            ->when($unpublished, fn($query) => $query->whereNot(fn($q) => $q->published()))
            ->when(!$unpublished, fn($query) => $query->published())
            ->whereHas('supplier', function ($query) {
                $query->where('is_available', 1);
            });

        if (!empty($searchTerms)) {
            $sanitizedTerm = $this->processSearchTerms($searchTerms);

            $query->where(function ($q) use ($sanitizedTerm) {
                foreach ($sanitizedTerm as $term) {
                    $q->orWhereRaw("LOWER(title) LIKE ?", ["%{$term}%"])
                    ->orWhereRaw("LOWER(searcheable) LIKE ?", ["%{$term}%"])
                    ->orWhereRaw("ean13 = ?", [$term])
                    ->orWhereRaw("reference = ?", [$term]);
                }
            });
        }

        $this->applyAdditionalFilters($query, $supplier, $brands, $categories, $attributes);

        return $query;
    }

    protected function getBadgeIsNullBuilder(
        ?Supplier $supplier,
        ?string $searchTerms,
        array $categories,
        ?array $brands,
        ?array $attributes,
        bool $unpublished
    ): Builder {
        $query = Product::query()
            ->with('supplier', 'brand', 'pAttributes', 'badge', 'route', 'images', 'coupons', 'category')
            ->select([
                'id', 'slug', 'title', 'inner_code', 'reference', 'supplier_id', 'unit_price',
                'unit_price_promotional', 'unit_minimal', 'box_price', 'box_price_promotional',
                'box_minimal', 'dun14', 'ean13', 'icms', 'ipi', 'release_year', 'ncm', 'catalog_name',
                'catalog_page', 'origin', 'box_packing_type', 'category_id', 'brand_id', 'packaging',
                'badge_id', 'availability', 'expected_arrival', 'deleted_at'
            ])
            ->whereNull('badge_id')
            ->when($unpublished, fn($query) => $query->whereNot(fn($q) => $q->published()))
            ->when(!$unpublished, fn($query) => $query->published())
            ->whereHas('supplier', function ($query) {
                $query->where('is_available', 1);
            });

        if (!empty($searchTerms)) {
            $sanitizedTerm = $this->processSearchTerms($searchTerms)->join(' ');

            $query->where(function ($q) use ($sanitizedTerm) {
                $q->orWhereRaw("LOWER(title) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("LOWER(searcheable) LIKE ?", ["%{$sanitizedTerm}%"])
                ->orWhereRaw("ean13 = ?", [$sanitizedTerm])
                ->orWhereRaw("reference = ?", [$sanitizedTerm]);
            });
        }

        $this->applyAdditionalFilters($query, $supplier, $brands, $categories, $attributes);

        return $query;
    }

    protected function processSearchTerms(string $searchTerms): Collection
    {
        return collect(preg_split('/\s+/', trim($searchTerms)))
            ->filter(fn($term) => strlen($term) > 1)
            ->map(fn($term) => preg_replace('/[^\p{L}\p{N}]+/u', '', strtolower($term)));
    }

    protected function applyAdditionalFilters(
        Builder $query,
        ?Supplier $supplier,
        ?array $brands,
        array $categories,
        ?array $attributes
    ): void {
        $query->when($supplier, function ($query) use ($supplier) {
            $query->where('supplier_id', $supplier->id)
                ->whereHas('supplier', function ($q) {
                    $q->where('is_available', true);
                });
        });

        $query->when(!empty($brands), fn($query) => $query->whereIn('brand_id', $brands))
            ->when(!empty($categories), fn($query) => $query->whereIn('category_id', $categories));

        if (!empty($attributes)) {
            foreach ($attributes as $attribute) {
                [$attributeId, $attributeValue] = explode('|', $attribute);
                $query->whereHas('pAttributes', fn($q) => $q->where('attribute_id', $attributeId)->where('value', $attributeValue));
            }
        }
    }

    protected function applySortingToBuilder(Builder $query, ?string $sortBy, array $badgeOrder, array $availabilityOrder, ?string $searchTerms): Builder {
        $badgeCase = $this->buildOrderCase('badge_id', $badgeOrder);
        $availabilityCase = $this->buildOrderCase('availability', $availabilityOrder);

        if (empty($searchTerms)) {
            if ($sortBy === 'random') {
                return $query
                    ->orderByRaw("{$badgeCase} ASC")
                    ->orderByRaw("{$availabilityCase} ASC")
                    ->orderByRaw('RAND()');
            }
        }

        return $query
                ->orderByRaw("{$badgeCase} ASC")
                ->orderByRaw("{$availabilityCase} ASC");
    }

    protected function buildOrderCase(string $field, array $orderValues): string {
        $cases = collect($orderValues)
            ->map(function($value, $index) use ($field) {
                $priority = $index; // Menor índice = maior prioridade
                $isNumeric = is_numeric($value);
                $valueStr = $isNumeric ? $value : "'{$value}'";
                return "WHEN {$field} = {$valueStr} THEN {$priority}";
            })
            ->join(' ');

        $fallback = count($orderValues);

        return "(CASE {$cases} ELSE {$fallback} END)";
    }

    protected function extractSortBy(?string $sortBy): array {

        if (empty($sortBy)) {
            return ['id', 'asc'];
        }

        return str_contains($sortBy, '-')
            ? explode('-', $sortBy)
            : [$sortBy, 'asc'];
    }

    protected function getSupplierCategoriesByBrands(
        Supplier $supplier,
        array    $brands = [],
        array    $selectedCategoryIds = []
    ): Collection
    {
        $categories = Cache::remember("categories_$this->baseCacheKey", Carbon::now()->addMinutes(720), function () use (
            $supplier,
            $brands,
            $selectedCategoryIds
        ) {
            $categories = Category::select(['id', 'name', 'slug', 'order', 'supplier_id'])
                ->whereHas('availableProducts')
                ->withCount('availableProducts')
                ->where('supplier_id', $supplier->id);

            if (count($brands)) {
                $brandCategories = Product::selectRaw('DISTINCT(category_id)')
                    ->where('supplier_id', $supplier->id)
                    ->whereIn('brand_id', $brands)
                    ->groupBy('category_id', 'brand_id')
                    ->pluck('category_id');

                $categories->whereIn('id', $brandCategories);
            }

            return $categories->orderBy('name')->get();
        });

        return $this->moveSelectedToTop(
            $categories->where('available_products_count', '>', 0) ?? collect([]),
            $selectedCategoryIds
        );
    }

    protected function getSupplierBrands(
        ?Supplier $supplier,
        array     $categories = [],
                  $selectedBrandIds = []
    ): Collection
    {
        $brands = Cache::remember("brands_$this->baseCacheKey", Carbon::now()->addMinutes(720), function () use (
            $supplier,
            $categories,
            $selectedBrandIds
        ) {
            $brands = Brand::select(['id', 'name', 'slug', 'image'])
                ->whereHas('availableProducts')
                ->withCount('availableProducts')
            ;

            $brandIds = Product::query();

            if ($supplier instanceof Supplier) {
                $brandIds->where('supplier_id', $supplier->id);
            }

            $brandIds = $brandIds->whereNotNull('brand_id');
            $brandIds = count($categories) ? $brandIds->whereIn('category_id', $categories) : $brandIds;
            $brandIds = $brandIds->groupBy('brand_id')->pluck('brand_id');

            return $brands->whereIn('id', $brandIds)->get();
        });

        return $this->moveSelectedToTop(
            $brands->where('available_products_count', '>', 0) ?? collect([]),
            $selectedBrandIds
        );
    }

    public function getAttributes(
        Builder $productBuilder,
        array   $selectedAttributes = []
    ): Collection
    {
                return Cache::remember("attributes_$this->baseCacheKey", Carbon::now()->addMinutes(720), function () use (
            $productBuilder,
            $selectedAttributes
        ) {
            $productsHasAttributes = $productBuilder->get();

            $attributes = [];
            foreach ($productsHasAttributes as $productHasAttributes) {
                $productAttributes = $productHasAttributes->pAttributes;

                foreach ($productAttributes as $attribute) {
                    if (empty($attributes[$attribute->id])) {
                        $attributes[$attribute->id] = [
                            'id' => $attribute->id,
                            'name' => $attribute->name,
                            'values' => []
                        ];
                    }
                    $attributeValue = $attribute->pivot;

                    $attributeData = [
                        'name' => $attributeValue->value,
                        'checked' => in_array("$attributeValue->attribute_id|$attributeValue->value", $selectedAttributes)
                    ];

                    if (!in_array($attributeData, $attributes[$attribute->id]['values']) && !empty($attributeData)) {
                        $attributes[$attribute->id]['values'][] = $attributeData;
                    }
                }
            }

            $attributes = collect($attributes)->map(function ($item) {
                $item['values'] = array_filter($item['values'], function ($value) {
                    return !empty($value['name']);
                });

                return $item;
            });

            return $attributes->filter(fn($attribute) => !empty($attribute['values']));
        });
    }

    protected function getBlogPosts($limit = 3): Collection|array
    {
        return BlogPost::with('category', 'images', 'route')->take($limit)->get();
    }

    protected function getBrandsThatHaveImage($limit = 20)
    {
        return Brand::select(['id', 'name', 'image'])->whereNotNull('image')->take($limit)->get();
    }

    public function getPriceWithPromotionDiscounts(int $productId, $qty = null)
    {
        $product = Product::find($productId);

        abort_if(!$product, 404);

        return $product->getPriceWithPromotionDiscounts($qty);
    }
}
