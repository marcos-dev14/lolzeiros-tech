<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BannerImageRequest;
use App\Http\Requests\BannerImageSortRequest;
use App\Http\Resources\BannerBlockResource;
use App\Http\Resources\BannerImageResource;
use App\Models\Admin\Banner\Block;
use App\Services\BannerImageService;
use App\Services\BannerService;
use App\Services\Utils\QueryCriteria;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\NoReturn;
use Throwable;

class BannerController extends BaseController
{
    #[NoReturn]
    public function __construct(
        protected BannerService $blockService,
        protected BannerImageService $imageService
    ) {}

    public function index(): JsonResponse
    {
        $this->blockService->counts = ['desktopImages', 'mobileImages'];
        $items = $this->blockService->all(false);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                BannerBlockResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            BannerBlockResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function images(Block $block): JsonResponse
    {
        $block->loadCount('desktopImages', 'mobileImages');
        $block->load(['desktopImages' => function ($query) {
            $query->orderBy('order');
        }, 'mobileImages' => function ($query) {
            $query->orderBy('order');
        }]);

        return $this->sendResponse(new BannerBlockResource($block), Lang::get('custom.found_register'));
    }

    public function storeImages(Request $request, Block $block): JsonResponse
    {
        $images = $request->images;

        if (empty($request->images)) {
            return $this->sendError('Envie pelo menos uma imagem', [
                'images' => ["O campo images é obrigatório"]
            ], 400);
        }

        if (!is_array($images)) {
            $images = [$images];
        }

        $validator = Validator::make([
            'platform' => $request->platform,
            'images' => $images
        ], [
            'platform' => [
                'required',
                'string',
                Rule::in([
                    Block::PLATFORM_DESKTOP,
                    Block::PLATFORM_MOBILE,
                ])
            ],
            'images' => 'required',
            'images.*' => 'mimes:png,jpeg,jpg,gif'
        ]);

        if ($validator->fails()) {
            return $this->sendError(
                $validator->errors()->first(),
                $validator->errors()->toArray(),
                400
            );
        }

        try {
            $this->imageService->store($block, $images, $request->platform);
            $block->loadCount('desktopImages', 'mobileImages');
            $block->load(['desktopImages' => function ($query) {
                $query->orderBy('order');
            }, 'mobileImages' => function ($query) {
                $query->orderBy('order');
            }]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }

        return $this->sendResponse(
            new BannerBlockResource($block),
             'Imagens enviadas com sucesso.'
        );
    }

    public function update(BannerImageRequest $request, Block $block, int $imageId): JsonResponse
    {
        try {
            $this->imageService->criteria = new QueryCriteria('block_id', $block->id);
            $item = $this->imageService->getById($imageId);
            $this->imageService->update($item, $request->validated());
            $item = $this->imageService->getById($imageId);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BannerImageResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(Block $block, int $imageId): JsonResponse
    {
        try {
            $this->imageService->criteria = new QueryCriteria('block_id', $block->id);
            $this->imageService->destroy($imageId);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }

    public function updateOrder(BannerImageSortRequest $request, Block $block): JsonResponse
    {
        try {
            $this->imageService->criteria = new QueryCriteria('block_id', $block->id);
            $this->imageService->updateOrder($request->validated()['images']);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        $block->loadCount('desktopImages', 'mobileImages');
        $block->load(['desktopImages' => function ($query) {
            $query->orderBy('order');
        }, 'mobileImages' => function ($query) {
            $query->orderBy('order');
        }]);

        return $this->sendResponse(
            new BannerBlockResource($block),
            Lang::get('custom.registers_updated')
        );
    }
}
