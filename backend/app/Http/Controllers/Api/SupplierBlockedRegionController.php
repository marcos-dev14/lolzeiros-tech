<?php

namespace App\Http\Controllers\Api;

use App\Models\BlockingRule;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class SupplierBlockedRegionController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Supplier     $_baseModel,
        private BlockingRule $_model,
    ) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachId = $request->attach_id;
        $attach = $this->_model->select(['id'])->find($attachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockedRegions')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($attach)) {
            return $this->sendError('Região não existe', [], 404);
        } elseif ($supplier->blockedRegions->contains($attachId)) {
            return $this->sendError('A região informada já está relacionada a representada', [], 400);
        }

        $supplier->blockedRegions()->attach($attach);

        return $this->sendResponse([], 'Região adicionado a lista de bloqueados com sucesso.');
    }

    public function destroy($id, $detachId): JsonResponse
    {
        $detach = $this->_model->select(['id'])->find($detachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockedRegions')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($detach)) {
            return $this->sendError('Região não existe', [], 404);
        } elseif (!$supplier->blockedRegions->contains($detachId)) {
            return $this->sendError('A região informada não está relacionada a representada', [], 400);
        }

        $supplier->blockedRegions()->detach($detach);

        return $this->sendResponse([], 'Região removida da lista com sucesso.');
    }
}
