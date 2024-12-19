<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CountryStateResource;
use App\Http\Resources\JustNameResource;
use App\Models\CountryState;
use App\Services\CountryStateService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class CountryStateController extends BaseController
{
    #[NoReturn]
    public function __construct(protected CountryStateService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $this->entityService->orderBy = 'name';
        $this->entityService->orderDirection = 'asc';
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                CountryStateResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            CountryStateResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function cities($countryState): JsonResponse
    {
        //Cache::forget("CITIES_FROM_STATE_$countryState");
        return Cache::rememberForever("CITIES_FROM_STATE_$countryState", function () use ($countryState) {
            $countryState = CountryState::where('code', $countryState)->orWhere('id', $countryState)->first();

            return $this->sendResponse(
                JustNameResource::collection($countryState->cities),
                Lang::get('custom.found_registers')
            );
        });
    }
}
