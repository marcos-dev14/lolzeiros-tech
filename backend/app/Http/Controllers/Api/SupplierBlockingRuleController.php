<?php

namespace App\Http\Controllers\Api;

use App\Models\BlockingRule;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class SupplierBlockingRuleController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Supplier     $_baseModel,
        private BlockingRule $_model,
    ) {}

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $attachId = $request->attach_id;
        $attach = $this->_model->select(['id'])->find($attachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockingRules')->find($supplierId);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($attach)) {
            return $this->sendError('Regra de bloqueio não existe', [], 404);
        } elseif ($supplier->blockingRules->contains($attachId)) {
            return $this->sendError('A regra informada já está relacionada a representada', [], 400);
        }

        $supplier->blockingRules()->attach($attach);

        return $this->sendResponse([], 'Regra de bloqueio adicionado a lista de bloqueados com sucesso.');
    }

    public function destroy($id, $detachId): JsonResponse
    {
        $detach = $this->_model->select(['id'])->find($detachId);
        $supplier = $this->_baseModel->select(['id'])->with('blockingRules')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($detach)) {
            return $this->sendError('Regra de bloqueio não existe', [], 404);
        } elseif (!$supplier->blockingRules->contains($detachId)) {
            return $this->sendError('A regra informada não está relacionada a representada', [], 400);
        }

        $supplier->blockingRules()->detach($detach);

        return $this->sendResponse([], 'Regra de bloqueio removida da lista com sucesso.');
    }
}
