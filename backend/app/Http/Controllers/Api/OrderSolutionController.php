<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class OrderSolutionController extends BaseController
{
    /**
     * @throws Throwable
     */
    public function ByExcel(Request $request)
    {
        $result = [];

        if (!$request->hasFile('fileToUpload')) {
            return response()->json(['error' => 'Arquivo não enviado'], 400);
        }

        $file = $request->file('fileToUpload');
        $extension = $file->getClientOriginalExtension();

        if (!in_array($extension, ['xlsx', 'xls', 'csv'])) {
            return response()->json(['error' => 'Formato de arquivo não suportado'], 400);
        }

        // Importar arquivo Excel ou CSV
        if ($extension == 'csv') {
            $data = Excel::toCollection([], $file);
        } else {
            $data = Excel::toArray([], $file);
            $data = $data[0];
        }

        foreach (array_slice($data, 1) as $doc) {
            $code = $doc[0];
            $order = Order::where('code', $code)->first();
            if (!$order) {
                $resultMessage = $code . ' Pedido não encontrado!';
                $result[] = $resultMessage;
            } else {
                $date = Carbon::createFromFormat('Y-m-d', '1900-01-01')
                            ->addDays($doc[1] - 2)
                            ->format('Y-m-d H:i:s');
                $order->created_at = $date;
                $order->save();
                $resultMessage = $code . ' Pedido atualizado de para '.$date .'!';
                $result[] = $resultMessage;
            }
        }

        return response()->json(['result' => $result], 200);

    }
}
