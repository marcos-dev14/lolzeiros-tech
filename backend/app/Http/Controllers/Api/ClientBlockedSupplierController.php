<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class ClientBlockedSupplierController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Client          $_baseModel,
        private Supplier $_model,
    ) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachSupplierId = $request->attach_supplier_id;
        $attachSupplier = $this->_model->select(['id'])->find($attachSupplierId);
        $client = $this->_baseModel->select(['id'])->with('blockedSuppliers')->find($id);

        if (is_null($client)) {
            return $this->sendError('Cliente não existe', [], 404);
        } elseif (is_null($attachSupplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif ($client->blockedSuppliers->contains($attachSupplierId)) {
            return $this->sendError('A representada informada já está relacionada ao cliente', [], 400);
        }

        $client->blockedSuppliers()->attach($attachSupplier);

        return $this->sendResponse([], 'Representada adicionada a lista de bloqueadas com sucesso.');
    }

    public function destroy($id, $detachSupplierId): JsonResponse
    {
        $detachSupplier = $this->_model->select(['id'])->find($detachSupplierId);
        $client = $this->_baseModel->select(['id'])->with('blockedSuppliers')->find($id);

        if (is_null($client)) {
            return $this->sendError('Cliente não existe', [], 404);
        } elseif (is_null($detachSupplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (!$client->blockedSuppliers->contains($detachSupplierId)) {
            return $this->sendError('A representada informada não está relacionada ao cliente', [], 400);
        }

        $client->blockedSuppliers()->detach($detachSupplier);

        return $this->sendResponse([], 'Representada removida da lista de bloqueadas com sucesso.');
    }
}
