<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceBillet;
use App\Models\InvoiceLog;
use App\Exports\InvoiceImportExcelLog;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\InvoiceBilletService;
use App\Services\InvoiceLogService;
use App\Services\InvoiceService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use JetBrains\PhpStorm\NoReturn;
use Throwable;

class InvoiceImportMassController extends BaseController
{
    public function __construct(
        public InvoiceService $invoiceService,
        public InvoiceBilletService $invoiceBilletService,
        public InvoiceLogService $invoiceLogService
    ) {
    }

    /**
     * @throws Throwable
     */
    public function ByExcel(Request $request, $id)
    {
        $result = [];
        $resultCount = [
            'Success' => 0,
            'Error' => 0,
        ];
        if (!$request->hasFile('fileToUpload')) {
            return response()->json(['error' => 'Arquivo não enviado'], 400);
        }

        $supplierId = $id;
        if (!$id || empty($id)) {
            return response()->json(['error' => 'Fornecedor não enviado'], 400);
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
        try {
            foreach (array_slice($data, 1) as $doc) {
                $orders = $this->getOrder($doc, $supplierId);
                $order = $orders->first();
                $canProceedMessage = $this->canProceed($orders, $doc);

                if ($canProceedMessage == 'OK') {
                    //               $nfeInstallments = is_array($nfeInfo->cobr->dup) ? $nfeInfo->cobr->dup : [];
                    $nfeInstallments = $doc[10] ?? 10;
                    $nfeDate = Carbon::parse($doc[8]);

                    $invoice = $this->createInvoice(
                        $orders->first(),
                        $doc
                    );
                    $this->createInvoiceBillets(
                        $invoice,
                        $doc
                    );

                    $user = auth()->user();

                    InvoiceLog::create([
                        'user_id' => $user->id,
                        'invoice_id' => $invoice->id,
                        'mod' => 'Fatura Gerada via importação excel',
                    ]);
                    $info = [
                        'supplierCode' => $doc[0],
                        'supplierDate' => $doc[1],
                        'supplier' => $doc[2],
                        'clientName' => $doc[3],
                        'clientDoc' => $doc[4],
                        'dateAuge' => $doc[5],
                        'nfe' => $doc[6],
                        'nfeValue' => $doc[7],
                        'nfeDate' => $doc[8],
                        'numberAuge' => $doc[9],
                        'paymentTerm' => $doc[10],
                        'commissionAugePorcent' => $doc[11],
                        'commissionAuge' => $doc[12],
                        'commissionCommercialPorcent' => $doc[13],
                        'commissionCommercialAuge' => $doc[14],
                        'obs' => $doc[15],
                        'message' => 'Faturado!',
                        'order_code' => $order->code,
                        'order_value' => $order->total_value

                    ];
                    $resultCount['Success'] += 1;

                    $result[] = $info;
                } else {
                    $info = [
                        'supplierCode' => $doc[0],
                        'supplierDate' => Carbon::createFromFormat('Y-m-d', '1900-01-01')
                            ->addDays($doc[1] - 2)
                            ->format('Y-m-d H:i:s'),
                        'supplier' => $doc[2],
                        'clientName' => $doc[3],
                        'clientDoc' => $doc[4],
                        'dateAuge' => Carbon::createFromFormat('Y-m-d', '1900-01-01')
                            ->addDays($doc[5] - 2)
                            ->format('Y-m-d H:i:s'),
                        'nfe' => $doc[6],
                        'nfeValue' => $doc[7],
                        'nfeDate' => $doc[8],
                        'numberAuge' => $doc[9],
                        'paymentTerm' => $doc[10],
                        'commissionAugePorcent' => $doc[11],
                        'commissionAuge' => $doc[12],
                        'commissionCommercialPorcent' => $doc[13],
                        'commissionCommercialAuge' => $doc[14],
                        'obs' => $doc[15],
                        'message' => $canProceedMessage,
                        'order_code' => $order->code,
                        'order_value' => $order->total_value
                    ];
                    $resultCount['Error'] += 1;
                    $result[] = $info;
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro de formatação. Verifique o documento. Detalhes: ' . $e->getMessage()
            ], 422);
        }

        if ($request->download == true) {
            return Excel::download(new InvoiceImportExcelLog($result), '' . now() . '_invoice_' . $supplierId . '.xlsx');
        }
        return response()->json([
            'resultCount' => $resultCount,
            'result' => $result
        ], 200);
    }

    /**
     * @throws Throwable
     */
    protected function canProceed(
        $orders,
        $doc
    ) {
        $nfe = ltrim($doc[6], '0');
        if ($orders->count() == 0) {
            return $resultMessage = 'Nenhuma venda a faturar foi encontrada';
        }

        $order = $orders->first();

        if ($order->invoices->where('number', $nfe)->count() > 0) {
            $invoice = $this->updateInvoice(
                $order,
                $doc
            );
            $user = auth()->user();

            InvoiceLog::create([
                'user_id' => $user->id,
                'invoice_id' => $invoice->id,
                'mod' => 'Fatura atualizada via importação xml',
            ]);
            return $resultMessage = "A nota foi atualizada!";
        }

        $this->destroyAutoGeneratedInvoice($order);

        return 'OK';
    }

    /**
     * @throws Throwable
     */
    protected function destroyAutoGeneratedInvoice(Order $order)
    {
        $invoices = $order->invoices()->where(function ($query) use ($order) {
            $query->whereNull('number')->orWhere('number', $order->code);
        })->get();

        foreach ($invoices as $invoice) {
            $this->invoiceService->destroy($invoice);
        }
    }

    protected function getOrder(
        $doc,
        $supplierId,
    ) {
        $supplierCode = ltrim($doc[0], '0');
        $supplierDate = $doc[1];
        $supplier = $doc[2];
        $clientName = $doc[3];
        $clientDoc = $doc[4];
        $dateAuge = $doc[5];
        $nfe = $doc[6];
        $nfeValue = $doc[7];
        $nfeDate = $doc[8];
        $numberAuge = $doc[9];
        $paymentTerm = $doc[10];
        $commissionAugePorcent = $doc[11];
        $commissionAuge = $doc[12];
        $commissionCommercialPorcent = $doc[13];
        $commissionCommercialAuge = $doc[14];
        $obs = $doc[15];

        $query = Order::with('invoices');
        if (!empty($supplierCode)) {
            $query->where('product_supplier_id', $supplierId)->where('external_order_id', $supplierCode);
        } else {
            /* $query->where(function ($query) use ($nfeValue) {
                $query->whereRaw('invoiced_value <= total_value_with_ipi')
                    ->orWhere('invoiced_value', 0)
                    ->orWhereNull('invoiced_value');
            }); */

            /* $date = Carbon::parse($nfeDate);
            $dateBefore = $date->clone()->addMonth(-3);
            $query->whereBetween('created_at', [$dateBefore, $date->addDays(7)]); */

            $value = $nfeValue - ($nfeValue * 0.1);

            if (!empty($nfeValue)) {
                $query->where('total_value_with_ipi', '>=', $value);
            }

            if (!empty($numberAuge)) {
                $query->where('code', $numberAuge);
            }

            if (!empty($supplierDate)) {
                $query->where('external_created_at', '>=', $supplierDate);
            }

            if (!empty($clientDoc)) {

                $document = $this->formatDocument($clientDoc);

                $client_id = Client::with('orders')->where('document', $document)->isAvailable()->first();

                $query->where('client_id', $client_id->id);
            }

            $query->where('product_supplier_id', $supplierId)->where('current_status', '!=', 'canceled');

            /*  if (!empty($client)) {
                 $query->where('client_id', $client->id);
             } */

        }

        return $query->get();
    }

    protected function createInvoiceBillets(
        Invoice $invoice,
        $doc
    ) {
        $installmentRules = explode('/', $doc[10]);
        $countInstallment = count($installmentRules);
        $startDate = Carbon::createFromFormat('Y-m-d', '1900-01-01')
            ->addDays($doc[8] - 2);
        $nfeQuantity = $countInstallment ?? 1;

        for ($i = 0; $i < $nfeQuantity; $i++) {
            $dueDate = $startDate->addDays($installmentRules[0]);

            $count = $i + 1;
            $invoiceBillets = InvoiceBillet::create([
                'number' => $invoice->number . ' - ' . $count,
                'due_date' => $dueDate->format('Y-m-d H:i:s'),
                'value' => $doc[7] / $invoice->term_qty,
                'commission' => $invoice->commission / $invoice->term_qty,
                'percentage_commission' => $invoice->percentage_commission ?? 0,
                'commercial_commission' => $invoice->commercial_commission / $invoice->term_qty,
                'commercial_percentage' => $invoice->commercial_percentage ?? 0,
                'paid_commission' => $dueDate->clone()->addMonth(1)->format('Y-m-d H:i:s'),
                'paid_commercial' => $dueDate->clone()->addMonths(2)->format('Y-m-d H:i:s'),
                'invoice_id' => $invoice->id,
                'invoice_billet_status_id' => 1,
                'title_bearer' => 'Fornecedor',
            ]);
        }
    }

    protected function createInvoice(
        Order $order,
        $doc
    ): Invoice {
        $supplier = $order->supplier;
        $client = $order->client;
        $clientProfile = $client->profile;
        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $augeCommission = ($supplierDiscount->auge_commission ?? 0) / 100 * ($doc[12] ?? $order->total_value);
        $commercialCommission = ($supplierDiscount->commercial_commission ?? 0) / 100 * ($doc[14] ?? $order->total_value);

        if (!empty($doc[13]) && !empty($doc[14])) {
            $commercialCommission = ($doc[13] ?? 0 / 100) * ($doc[14] ?? 0);
        }

        if (!empty($doc[11]) && !empty($doc[12])) {
            $augeCommission = ($doc[11] ?? 0 / 100) * ($doc[12] ?? 0);
        }

        $installmentRules = explode('/', $order->installment_rule);
        $countInstallment = count($installmentRules);
        $billetsValuePercentage = $order->total_value / $countInstallment;
        $augeBilletsCommission = ($supplierDiscount?->auge_commission / 100) * $billetsValuePercentage;
        $commercialBilletsCommission = ($supplierDiscount?->commercial_commission / 100) * $billetsValuePercentage;

        $installmentRules = explode('/', $doc[10] ?? $order->installment_rule);
        $countInstallment = count($installmentRules);

        $invoice = Invoice::create([
            'number' => ltrim($doc[6], '0') ?? $order->code,
            'issuance_date' => Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[8] - 2)
                ->format('Y-m-d H:i:s') ?? now()->format('Y-m-d 00:00:00'),
            'value' => $doc[7] ?? $order->total_value,
            'term_payment' => $doc[10] ?? $order->installment_rule,
            'observation' => $doc[15] ?? null,
            'term_qty' => $countInstallment ?? 1,
            'commission' => $doc[12] ?? $augeCommission,
            'percentage_commission' => $doc[11] ?? $supplierDiscount?->auge_commission ?? 0,
            'commercial_commission' => $doc[14] ?? $commercialCommission,
            'commercial_percentage' => $doc[13] ?? $supplierDiscount?->commercial_commission ?? 0,
            'order_status_id' => optional($order->orderStatuses()->first())->id,
            'order_id' => $order->id,
        ]);

        if ($order->current_status !== 'billed') {
            $user = auth()->user();
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);

            $order->current_status = 'billed';
            $order->update();
        }

        /* $this->invoiceLogService->make(
            $this->invoiceLogService->getMakeData(
                $invoice,
                'Invoice criado via importação de XML'
            )
        ); */

        return $invoice;
    }

    protected function updateInvoice(
        Order $order,
        $doc
    ) {
        $supplier = $order->supplier;
        $client = $order->client;
        $invoice = $order->invoices->where('number', $doc[6])->first();
        $invoiceOld = $order->invoices->where('number', $doc[6])->first();
        $clientProfile = $client->profile;
        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $augeCommission = ($supplierDiscount->auge_commission ?? 0) / 100 * ($doc[12] ?? $order->total_value);
        $commercialCommission = ($supplierDiscount->commercial_commission ?? 0) / 100 * ($doc[14] ?? $order->total_value);

        if (!empty($doc[13]) && !empty($doc[14])) {
            $commercialCommission = ($doc[13] ?? 0 / 100) * ($doc[14] ?? 0);
        }

        if (!empty($doc[11]) && !empty($doc[12])) {
            $augeCommission = ($doc[11] ?? 0 / 100) * ($doc[12] ?? 0);
        }

        $installmentRules = explode('/', $order->installment_rule);
        $countInstallment = count($installmentRules);
        $billetsValuePercentage = $order->total_value / $countInstallment;
        $augeBilletsCommission = ($supplierDiscount?->auge_commission / 100) * $billetsValuePercentage;
        $commercialBilletsCommission = ($supplierDiscount?->commercial_commission / 100) * $billetsValuePercentage;

        $installmentRules = explode('/', $doc[10] ?? $order->installment_rule);
        $countInstallment = count($installmentRules);

        $invoiceData = [
            'number' => $doc[6] ?? $invoiceOld->number,
            'issuance_date' => Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[8] - 2)
                ->format('Y-m-d H:i:s') ?? $invoiceOld->issuance_date,
            'value' => $doc[7] ?? $invoiceOld->value,
            'term_payment' => $doc[10] ?? $invoiceOld->term_payment,
            'observation' => $doc[15] ?? $invoiceOld->observation,
            'term_qty' => $countInstallment ?? $invoiceOld->term_qty,
            'commission' => $augeCommission ?? $invoiceOld->commission,
            'percentage_commission' => $doc[11] ?? $invoiceOld->percentage_commission,
            'commercial_commission' => $commercialCommission ?? $invoiceOld->commercial_commission,
            'commercial_percentage' => $doc[13] ?? $invoiceOld->commercial_percentage,
            'order_status_id' => optional($order->orderStatuses()->first())->id,
        ];

        $invoice = Invoice::updateOrCreate(['id' => $invoiceOld->id], $invoiceData);

        if ($order->current_status !== 'billed') {
            $user = auth()->user();
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);

            $order->current_status = 'billed';
            $order->update();
        }

        /* $this->invoiceLogService->make(
            $this->invoiceLogService->getMakeData(
                $invoice,
                'Invoice criado via importação de XML'
            )
        ); */

        return $invoice;
    }

    protected function formatDocument(string $document)
    {
        $document = preg_replace("/\D/", '', $document);

        return preg_replace("/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/", "\$1.\$2.\$3/\$4-\$5", $document);
    }

    public function invoiceDownload()
    {
        $fileUrl = 'https://augeapp.com.br/xlsxModel/modelo.xlsx';

        // Usar file_get_contents para buscar o arquivo diretamente da URL
        $fileContents = file_get_contents($fileUrl);

        if ($fileContents === false) {
            return response()->json(['error' => 'Arquivo não encontrado'], 404);
        }

        // Definir o nome do arquivo para download
        $fileName = 'modelo.xlsx';

        // Retornar o arquivo para download
        return response($fileContents)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    }
}
