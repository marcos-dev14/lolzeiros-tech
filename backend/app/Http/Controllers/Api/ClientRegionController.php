<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\BlockingRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class ClientRegionController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Client       $_baseModel,
        private BlockingRule $_model,
    ) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachId = $request->attach_id;
        $attach = $this->_model->select(['id'])->find($attachId);
        $client = $this->_baseModel->select(['id'])->with('regions')->find($id);

        if (is_null($client)) {
            return $this->sendError('Cliente não existe', [], 404);
        } elseif (is_null($attach)) {
            return $this->sendError('Região não existe', [], 404);
        } elseif ($client->regions->contains($attachId)) {
            return $this->sendError('A região informada já está relacionada ao cliente', [], 400);
        }

        $client->regions()->attach($attach);

        return $this->sendResponse([], 'Região adicionado a lista com sucesso.');
    }

    public function destroy($id, $detachId): JsonResponse
    {
        $detach = $this->_model->select(['id'])->find($detachId);
        $client = $this->_baseModel->select(['id'])->with('regions')->find($id);

        if (is_null($client)) {
            return $this->sendError('Cliente não existe', [], 404);
        } elseif (is_null($detach)) {
            return $this->sendError('Região não existe', [], 404);
        } elseif (!$client->regions->contains($detachId)) {
            return $this->sendError('A região informada não está relacionada ao cliente', [], 400);
        }

        $client->regions()->detach($detach);

        return $this->sendResponse([], 'Região removida da lista com sucesso.');
    }
}
