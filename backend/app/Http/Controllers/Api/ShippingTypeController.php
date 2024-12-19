<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\JustNameResource;
use App\Services\ShippingTypeService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class ShippingTypeController extends BaseController
{
    #[NoReturn]
    public function __construct(protected ShippingTypeService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                JustNameResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            JustNameResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }
}
