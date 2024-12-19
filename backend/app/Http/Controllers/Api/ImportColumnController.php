<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Product\ImportColumnResource;
use App\Models\Import;
use App\Models\ImportColumns;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class ImportColumnController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Import $_baseModel,
        private ImportColumns $_model
    ) {}

    public function getAvailableFields(): JsonResponse
    {
        $fields = collect(['columns' => collect($this->_model::AVAILABLE_COLUMNS)->except('size_cubic', 'box_cubic')]);
        $fields['columns'] = $fields['columns']->sort();

        return $this->sendResponse($fields, 'Configurações encontradas');
    }

    public function store(Request $request, int $importId): JsonResponse
    {
        $import = $this->_baseModel->with('columns')->find($importId);

        if (is_null($import)) {
            return $this->sendError('Importação não existe', [], 404);
        }

        $columns = $request->only(array_keys($this->_model::AVAILABLE_COLUMNS));

        foreach ($columns as $field => $columnValue) {
            $existsColumn = $import->columns()->where('column', $columnValue)->where('field_name', '!=', $field)->count();

            if ($existsColumn) {
                return $this->sendError('Já existe um campo cadastrado para esta coluna', [], 400);
            }

            $existsField = $import->columns()->where('field_name', $field)->first();

            if ($existsField) {
                if ($existsField->column != $columnValue) {
                    $existsField->update(['column' => $columnValue]);
                }

                continue;
            }

            $this->_model->create([
                'field_name' => $field,
                'column' => $columnValue,
                'import_id' => $importId
            ]);
        }

        $import->load('columns');

        return $this->sendResponse(ImportColumnResource::collection($import->columns), 'Coluna adicionada com sucesso.', 201);
    }

    public function destroy(int $importId, int $columnId): JsonResponse
    {
        $import = $this->_baseModel->find($importId);

        if (is_null($import)) {
            return $this->sendError('Importação não existe', [], 404);
        }

        $column = $import->columns()->find($columnId);

        if (!$column) {
            return $this->sendError('Coluna não encontrada', [], 404);
        }

        $column->delete();

        return $this->sendResponse([], 'Coluna removida');
    }
}
