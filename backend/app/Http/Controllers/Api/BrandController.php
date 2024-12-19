<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BrandRequest;
use App\Http\Resources\Product\BrandResource;
use App\Services\BrandService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;
use Exception;

class BrandController extends BaseController
{
    #[NoReturn]
    public function __construct(protected BrandService $entityService){}

    /**
     * @throws Exception
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $this->filter($request);
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                BrandResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            BrandResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    /**
     * @throws Exception
     */
    protected function filter(Request $request): void
    {
        $filters = $request->only(
            'has_supplier',
            'with_products',
            'slug',
            'name'
        );

        $validator = Validator::make($filters, [
            'has_supplier' => 'string|exists:product_suppliers,id,deleted_at,NULL',
            'slug' => 'string',
            'name' => 'string',
            'with_products' => 'string'
        ]);

        if ($validator->fails()) {
            throw new Exception($validator->errors()->first(), 400);
        }

        if (!empty($filters)) {
            $criteria = [];

            foreach ($filters as $key => $value) {
                if (str_contains($key, 'has_')) {
                    if ($value === 'false') {
                        continue;
                    }

                    $scope = explode('_', $key);
                    $scope = $scope[0] . ucfirst(strtolower($scope[1]));

                    $criteria[] = new QueryCriteria($scope, $value, 'hasScope');
                    continue;
                }

                if (str_contains($key, 'by_')) {
                    $relation = str_replace('by_', '', $key);

                    $criteria[] = new QueryCriteria("{$relation}_id", $value);
                    continue;
                }

                if (str_contains($key, 'with_')) {
                    $relation = explode('_', str_replace('with_', 'has_', $key));

                    $criteria[] = new QueryCriteria(
                        strtolower($relation[1]),
                        null,
                        ($value !== 'false') ? 'hasRelation' : 'doesntHaveRelation'
                    );
                    continue;
                }

                if ($key == 'name' || $key == 'slug') {
                    $criteria[] = new QueryCriteria($key, "%$value%", 'like');

                    continue;
                }

                $criteria[] = new QueryCriteria($key, $value);
            }

            if (count($criteria)) {
                $this->entityService->criteria = new QueryCriteriaCollection('and', ...$criteria);
            }
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $item = $this->entityService->getById($id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BrandResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function store(BrandRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->makeWithImage($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BrandResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(BrandRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->updateWithImage($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BrandResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroyWithImage($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
