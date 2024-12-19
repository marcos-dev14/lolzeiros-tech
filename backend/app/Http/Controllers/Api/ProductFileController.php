<?php

namespace App\Http\Controllers\Api;

use App\Models\File;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;

class ProductFileController extends BaseController
{
    #[NoReturn]
    public function __construct(private Product $_model) {}

    public function store(Request $request, $productId): JsonResponse
    {
        $validator = Validator::make($request->only('file', 'name'), [
            'file' => 'required|mimes:pdf,docx',
            'name' => 'required|min:2|max:30'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $product = $this->_model->find($productId);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        }

        if (!$request->file('file')->isValid()) {
            return $this->sendError($request->file('file')->getErrorMessage(), [$request->file('file')->getErrorMessage()]);
        }

        $path = str_replace('{id}', $product->id, $this->_model::FILEABLE_PATH);
        $label = $request->name;
        $name = Str::slug($label) .  '-' . time() . '.' . $request->file->extension();

        try {
            $request->file->storePubliclyAs($path, $name, 'public');

            $uploadedFile = new File([
                'name' => $name,
                'label' => $label
            ]);
            $product->files()->save($uploadedFile);

        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }

        return $this->sendResponse([], 'Arquivo enviado com sucesso.');
    }

    public function destroy($productId, $fileId): JsonResponse
    {
        $product = $this->_model->find($productId);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        }

        $file = $product->files()->find($fileId);

        if (!$file) {
            return $this->sendError('Arquivo não encontrado', [], 404);
        }

        $path = str_replace('{id}', $product->id, $this->_model::FILEABLE_PATH);
        $filePath = "public/$path/$file->name";

        if (Storage::exists($filePath)) Storage::delete($filePath);

        $file->delete();

        return $this->sendResponse([], 'Arquivo removido');
    }
}
