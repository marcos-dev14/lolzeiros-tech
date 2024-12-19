<?php

namespace App\Http\Controllers\Api;

use App\Models\InvoiceBilletStatus;
use Illuminate\Http\Request;

class InvoiceBilletStatusesController extends BaseController
{
    public function index()
    {
        $statuses = InvoiceBilletStatus::all();
        return response()->json(['statuses' => $statuses]);
    }

    public function show(InvoiceBilletStatus $invoiceBilletStatus)
    {
        return response()->json(['status' => $invoiceBilletStatus]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
        ]);

        $billetStatuses = new InvoiceBilletStatus;
        $billetStatuses->name = $request->name;
        $billetStatuses->save();

        return response()->json(['status' => 'success', 'message' => 'Operação realizada com sucesso.']);
    }

    public function update(Request $request, InvoiceBilletStatus $invoiceBilletStatus)
    {
        $validatedData = $request->validate([
            'name' => 'required',
        ]);

        if ($invoiceBilletStatus) {
            $invoiceBilletStatus->name = $request['name'];
            $invoiceBilletStatus->save();
            return response()->json([
                'status' => 'success',
                'message' => 'Operação realizada com sucesso.'
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'Registro não encontrado.'], 404);
    }

    public function destroy(InvoiceBilletStatus $invoiceBilletStatus)
    {
        if ($invoiceBilletStatus) {
            $invoiceBilletStatus->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Registro deletado com sucesso.'
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'Registro não encontrado.'], 404);
    }
}
