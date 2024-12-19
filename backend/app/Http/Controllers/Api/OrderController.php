<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\OrderListRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Resources\OrderListResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\OrderService;
use App\Services\Utils\QueryCriteria;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OrderExport;

class OrderController extends BaseController
{
    #[NoReturn]
    public function __construct(protected OrderService $entityService)
    {
    }

    public function index(OrderListRequest $request): JsonResponse
    {
        try {
            $this->entityService->enableFilters($request->validated());
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        $items = $this->entityService->all($request->paginated, $request->per_page);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                OrderListResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            OrderListResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function show($orderCode): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('code', $orderCode);
            $item = $this->entityService->getBy($orderCode, 'code');
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new OrderResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(OrderUpdateRequest $request, string $orderCode): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('code', $orderCode);
            $item = $this->entityService->getBy($orderCode, 'code');

            $requestFields = $request->validated();
            /* if (!empty($requestFields['origin'])) {
                $item->origin = $request->origin;
            } */
            if (!empty($requestFields['current_status'])) {
                $this->storeNewStatus($item, $requestFields['current_status']);
                unset($requestFields['current_status']);
            }

            $this->entityService->update($item, $requestFields);
            $item = $this->entityService->getBy($orderCode, 'code');
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new OrderResource($item),
            Lang::get('custom.register_updated')
        );
    }

    protected function storeNewStatus(Model|Order $order, $newStatusName)
    {
        //  if (!$order->orderStatuses()->where('name', $newStatusName)->count()) {
        //if (
        //    $newStatusName === 'canceled'
        //    || !$order->orderStatuses()->where('name', 'canceled')->count()
        //  ) {
        $user = auth()->user();
        OrderStatus::create([
            'name' => $newStatusName,
            'user_name' => $user->name,
            'order_id' => $order->id
        ]);
        if($newStatusName == 'canceled')
        {
            foreach ($order->invoices as $invoice) {
                $invoice->status = 3;
                $invoice->update();
            }
        }
       
        //  }
        //  }
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroy($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }

    public function orderExport($code)
    {
        $order = Order::with(['products', 'coupon.client'])->where('code', $code)->first();

        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        }

        return Excel::download(new OrderExport($order), 'pedido_' . $code . '.xlsx');

    }
}
