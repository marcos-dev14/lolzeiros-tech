<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BuyerRequest;
use App\Http\Resources\BuyerResource;
use App\Models\Buyer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class BuyerController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Buyer $_model
    ){}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->orderBy('updated_at', 'desc');

        if (!empty($request->name) || !empty($request->search)) {
            $searchTerm = $request->name ?? $request->search;
            $builder->where('name', 'like', "%$searchTerm%")
            ->orWhere('email', 'like', "%$searchTerm%");
        }

        if (!empty($request->has_group)) {
            $hasGroupValue = $request->has_group;
            $method = ($hasGroupValue !== 'false') ? 'has' : 'doesntHave';

            $builder->$method('group');
        }

        if ($request->paginated == 'true') {
            $items = $builder->where('active', 1)->paginate(50);

            return $this->sendResponse(
                BuyerResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }
    
        $items = $builder->where('active', 1)->take(100)->get();

        return $this->sendResponse(BuyerResource::collection($items), Lang::get('custom.found_registers'));
    }

    public function show($id): JsonResponse
    {
        $item = $this->_model->with('clients.addresses.type', 'clients.addresses.state')->find($id);

        if (is_null($item)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        return $this->sendResponse(new BuyerResource($item), Lang::get('custom.found_register'));
    }

    public function store(BuyerRequest $request): JsonResponse
    {
        $requestFields = $request->validated();

        $groupName = $requestFields['group_name'];
        unset($requestFields['group_name']);

        // Checks if record has been deleted, restores if so
        $buyerExists = $this->_model->where('email', $requestFields['email'])->withTrashed()->first();
        if ($buyerExists) {
            if (!$buyerExists->trashed()) {
                return $this->sendError('O email informado já está sendo utilizado.');
            }

            $buyerExists->restore();
            $buyerExists->fill($requestFields);
            $buyerExists->save();

            return $this->sendResponse(new BuyerResource($buyerExists), Lang::get('custom.register_updated'));
        }

        $buyer = $this->_model->fill($requestFields);
        $buyer->save();

        $buyer->group()->create([
            'name' => $groupName
        ]);

        return $this->sendResponse(new BuyerResource($buyer), Lang::get('custom.register_added'), 201);
    }

    public function update(BuyerRequest $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $item->update($request->validated());

        return $this->sendResponse(new BuyerResource($item), Lang::get('custom.register_updated'));
    }

    public function destroy($itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        if (!$item->can_be_deleted) {
            return $this->sendError(Lang::get('custom.cannot_be_deleted'), [], 400);
        }

        $item->delete();

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
