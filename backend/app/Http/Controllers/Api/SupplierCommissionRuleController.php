<?php

namespace App\Http\Controllers\Api;

use App\Models\CommissionRule;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class SupplierCommissionRuleController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Supplier $_baseModel,
        private CommissionRule  $_model,
    ) {}

    public function store(Request $request, $id): JsonResponse
    {
        $intendedAttachCommissionRuleId = $request->attach_id;

        if (is_array($intendedAttachCommissionRuleId)) {
            $intendedAttachCommissionRuleId = $intendedAttachCommissionRuleId[0];
        }

        $commissionRule = $this->_model->select(['id'])->find($intendedAttachCommissionRuleId);
        $supplier = $this->_baseModel->select(['id'])->with('commissionRules')->find($id);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($commissionRule)) {
            return $this->sendError('Regra de comissão não existe', [], 404);
        } elseif ($supplier->commissionRules->contains($intendedAttachCommissionRuleId)) {
            return $this->sendError('A regra informada já está relacionada a representada', [], 400);
        }

        $supplier->commissionRules()->attach($commissionRule);

        return $this->sendResponse([], 'Regra de comissão adicionada a lista de bloqueadas com sucesso.');
    }

    public function destroy($supplierId, $detachId): JsonResponse
    {
        $intendedDetachCommissionRule = $this->_model->select(['id'])->find($detachId);
        $supplier = $this->_baseModel->select(['id'])->with('commissionRules')->find($supplierId);

        if (is_null($supplier)) {
            return $this->sendError('Representada não existe', [], 404);
        } elseif (is_null($intendedDetachCommissionRule)) {
            return $this->sendError('Regra de comissão não existe', [], 404);
        } elseif (!$supplier->commissionRules->contains($detachId)) {
            return $this->sendError('A regra informada não está relacionada a representada', [], 400);
        }

        $supplier->commissionRules()->detach($intendedDetachCommissionRule);

        return $this->sendResponse([], 'Regra de comissão removida da lista com sucesso.');
    }
}
