<?php

namespace App\Http\Controllers\Api;

use App\Models\CountryState;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class SupplierBlockedStateController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Supplier $_baseModel,
        private CountryState    $_model,
    ) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachId = $request->attach_id;
        $attach = $this->_model->select(['id'])->find($attachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockedStates')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($attach)) {
            return $this->sendError('Estado não existe', [], 404);
        } elseif ($supplier->blockedStates->contains($attachId)) {
            return $this->sendError('O estado informado já está relacionado a representada', [], 400);
        }

        $supplier->blockedStates()->attach($attach);

        return $this->sendResponse([], 'Estado adicionado a lista de bloqueados com sucesso.');
    }

    public function destroy($id, $detachId): JsonResponse
    {
        $detach = $this->_model->select(['id'])->find($detachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockedStates')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($detach)) {
            return $this->sendError('Estado não existe', [], 404);
        } elseif (!$supplier->blockedStates->contains($detachId)) {
            return $this->sendError('O estado informado não está relacionado a representada', [], 400);
        }

        $supplier->blockedStates()->detach($detach);

        return $this->sendResponse([], 'Estado removida da lista com sucesso.');
    }
}
