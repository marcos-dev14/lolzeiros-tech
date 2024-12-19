<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceBillet;
use App\Models\InvoiceLog;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\InvoiceBilletService;
use App\Services\InvoiceLogService;
use App\Services\InvoiceService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use JetBrains\PhpStorm\NoReturn;
use Throwable;

class InvoiceBilletsImportMassController extends BaseController
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
        $resultCount = [
            'Success' => 0,
            'Error' => 0,
        ];

        if (!$request->hasFile('fileToUpload')) {
            return response()->json(['error' => 'Arquivo não enviado'], 400);
        }

        $file = $request->file('fileToUpload');
        $extension = $file->getClientOriginalExtension();

        $supplierId = $id;
        if (!$id || empty($id)) {
            return response()->json(['error' => 'Fornecedor não enviado'], 400);
        }

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
            $invoices = $this->getInvoice($doc, $supplierId);

            if (
                //                true
                $this->canProceed($invoices, $doc) == 'OK'
            ) {
                //               $nfeInstallments = is_array($nfeInfo->cobr->dup) ? $nfeInfo->cobr->dup : [];
                $invoiceProcess = $this->processInvoiceBillets(
                    $invoices,
                    $doc
                );

                if ($invoiceProcess) {
                    $info = [
                        'supplierCode' => $doc[0],
                        'code' => $doc[1],
                        'billetDueDate' => $doc[2],
                        'billetPaidAt' => $doc[3],
                        'billetNumber' => empty($doc[5])
                            ? (preg_match('/[.\/-]/', $doc[4])
                                ? ltrim(explode('.', $doc[4])[0], '0') . ' - ' . (explode('.', $doc[4])[1] ?? 1)
                                : $doc[4])
                            : $doc[4] . ' - ' . ($doc[5] ?? 1),
                        'clientName' => $doc[6],
                        'clientDoc' => $doc[7],
                        'billetValue' => $doc[8],
                        'billetDiscounted' => $doc[9],
                        'commissionAugePorcent' => $doc[10],
                        'commissionAuge' => $doc[11],
                        'commissionCommercialPorcent' => $doc[12],
                        'commissionCommercial' => $doc[13],
                        'billetDiscount' => $doc[14],
                        'billetObs' => $doc[15],
                        'message' => $this->processInvoiceBillets(
                            $invoices,
                            $doc
                        ),
                    ];
                    $resultCount['Error'] += 1;
                    $result[] = $info;
                } else {
                    $info = [
                        'supplierCode' => $doc[0],
                        'code' => $doc[1],
                        'billetDueDate' => $doc[2],
                        'billetPaidAt' => $doc[3],
                        'billetNumber' => empty($doc[5])
                            ? (preg_match('/[.\/-]/', $doc[4])
                                ? ltrim(explode('.', $doc[4])[0], '0') . ' - ' . (explode('.', $doc[4])[1] ?? 1)
                                : $doc[4])
                            : $doc[4] . ' - ' . ($doc[5] ?? 1),
                        'clientName' => $doc[6],
                        'clientDoc' => $doc[7],
                        'billetValue' => $doc[8],
                        'billetDiscounted' => $doc[9],
                        'commissionAugePorcent' => $doc[10],
                        'commissionAuge' => $doc[11],
                        'commissionCommercialPorcent' => $doc[12],
                        'commissionCommercial' => $doc[13],
                        'billetDiscount' => $doc[14],
                        'billetObs' => $doc[15],
                        'message' => 'baixa feita!',
                    ];
                    $resultCount['Success'] += 1;
                    $result[] = $info;
                }
            } else {
                $info = [
                    'supplierCode' => $doc[0],
                    'code' => $doc[1],
                    'billetDueDate' => $doc[2],
                    'billetPaidAt' => $doc[3],
                    'billetNumber' => empty($doc[5])
                        ? (preg_match('/[.\/-]/', $doc[4])
                            ? ltrim(explode('.', $doc[4])[0], '0') . ' - ' . (explode('.', $doc[4])[1] ?? 1)
                            : $doc[4])
                        : $doc[4] . ' - ' . ($doc[5] ?? 1),
                    'clientName' => $doc[6],
                    'clientDoc' => $doc[7],
                    'billetValue' => $doc[8],
                    'billetDiscounted' => $doc[9],
                    'commissionAugePorcent' => $doc[10],
                    'commissionAuge' => $doc[11],
                    'commissionCommercialPorcent' => $doc[12],
                    'commissionCommercial' => $doc[13],
                    'billetDiscount' => $doc[14],
                    'billetObs' => $doc[15],
                    'message' => $this->canProceed($invoices, $doc),
                ];
                $resultCount['Error'] += 1;
                $result[] = $info;
            }

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
        $invoices,
        $doc
    ) {
        $nfe = $doc[4];
        if ($invoices->count() == 0) {
            return $resultMessage = 'Nenhuma fatura foi encontrada';
        }

        $count = $invoices->count();
        if ($count > 1) {
            return $resultMessage = "Mais de uma nota encontrada!";
        }
        /* if ($orderCode == null) {
            $invoicedValue = $order->invoiced_value;
            $orderTotal = $order->total_value;
            $invoicedDiff = $orderTotal - $invoicedValue;
            if ($invoicedDiff < $nfeValue) {
                $this->returnSum($order, $invoicedDiff, $nfeValue);
            }
             throw_if(
                $invoicedDiff < $nfeValue,
                new Exception(
                    "Resta apenas R$ " . formatMoney($invoicedDiff) . " para ser faturado, mas a nota enviada tem valor de R$ " . formatMoney($nfeValue),
                    400
                )

            );
        } */
        return 'OK';
    }

    /**
     * @throws Throwable
     */

    protected function getInvoice(
        $doc,
        $supplierId,
    ) {
        $nfe = ltrim($doc[4], '0');
        if (empty($doc[5])) {
            if (preg_match('/[.\/-]/', $doc[4])) {
                $parts = preg_split('/[.\/-]/', $doc[4]);
                $nfe = ltrim($parts[0], '0');
            }
        }
        $supplierCode = ltrim($doc[0], '0');
        $code = $doc[1];
        $clientName = $doc[6];
        $clientDoc = $doc[7];

        $query = Invoice::with('order', 'invoiceBillets');

        if (!empty($nfe) && !empty($supplierId)) {
            $query->where('number', $nfe)
                ->whereHas('order', function ($q) use ($supplierId) {
                    $q->where('product_supplier_id', $supplierId)
                        ->where('current_status', '!=', 'canceled');
                });
        }

        if (!empty($supplierCode)) {
            $query->whereHas('order', function ($q) use ($supplierCode) {
                $q->where('external_order_id', $supplierCode);
            });
        }

        if (!empty($code)) {
            $query->whereHas('order', function ($q) use ($code) {
                $q->where('code', $code);
            });
        }

        if (!empty($clientDoc)) {
            $document = $this->formatDocument($clientDoc);
            $client = Client::with('orders')->where('document', $document)->isAvailable()->first();

            if ($client) {
                $query->whereHas('order', function ($q) use ($client) {
                    $q->where('client_id', $client->id);
                });
            }
        }

        return $query->get();
    }

    protected function processInvoiceBillets(
        $invoices,
        $doc
    ) {
        $invoice = $invoices->first();

        $supplier = $invoice->order->supplier;
        $client = $invoice->order->client;
        $clientProfile = $client->profile;
        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $billetDueDate = Carbon::createFromFormat('Y-m-d', '1900-01-01')
            ->addDays($doc[2] - 2)
            ->format('Y-m-d H:i:s');
        $billetPaidAt = Carbon::createFromFormat('Y-m-d', '1900-01-01')
            ->addDays($doc[3] - 2)
            ->format('Y-m-d H:i:s');
        if (empty($doc[5])) {
            if (preg_match('/[.\/-]/', $doc[4])) {
                $parts = preg_split('/[.\/-]/', $doc[4]);
                $billetNumber = ltrim($parts[0], '0') . ' - ' . ($this->numberFormatted($doc, $supplier));
            }
        } else {
            $billetNumber = ltrim($doc[4], '0') . ' - ' . ($this->numberFormatted($doc, $supplier));
        }

        $billetValue = $doc[8];
        $billetDiscounted = $doc[9];
        $commissionAugePorcent = $doc[10] ?? $supplierDiscount?->auge_commission ?? 0;
        $commissionAuge = $doc[11] ?? ($supplierDiscount?->auge_commission ?? 0) / 100 * $billetValue;
        $commissionCommercialPorcent = $doc[12] ?? $supplierDiscount?->commercial_commission ?? 0;
        $commissionCommercial = $doc[13] ?? ($supplierDiscount?->commercial_commission ?? 0) / 100 * $billetValue;
        $billetDiscount = $doc[14];
        $billetObs = $doc[15];
        $nfe = ltrim($doc[4], '0');

        if (!$invoice) {
            return $resultMessage = "Fatura não encontrada!";

        }

        $invoiceBillet = $invoice->invoiceBillets()->where('number', $billetNumber)->first();

        if (!$invoiceBillet) {
            return $resultMessage = "Titulo não encontrado!";
        }
        if (!empty($doc[2])) {
            $invoiceBillet->due_date = $billetDueDate;
        }
        if (!empty($billetValue)) {
            $invoiceBillet->value = $billetValue;
        }
        if (!empty($billetDiscount)) {
            $invoiceBillet->discount = $billetDiscount;
        }
        if (!empty($billetDiscounted)) {
            $invoiceBillet->discounted_price = $billetDiscounted;
            if (empty($doc[10])) {
                $commissionAuge = ($invoiceBillet->percentage_commission / 100) * $billetDiscounted;
                $invoiceBillet->commission = $commissionAuge;
            }
            if (empty($doc[12])) {
                $commissionCommercial = ($invoiceBillet->commercial_percentage / 100) * $billetDiscounted;
                $invoiceBillet->commercial_commission = $commissionCommercial;
            }
        }
        if (!empty($doc[10])) {
            $invoiceBillet->percentage_commission = $doc[10];
            $commissionValue = $billetDiscounted ?? $invoiceBillet->discounted_price;
            $commissionAuge = ($doc[10] / 100) * $commissionValue;
            $invoiceBillet->commission = $commissionAuge;
        }
        if (!empty($doc[11])) {
            $invoiceBillet->commission = $commissionAuge;
        }
        if (!empty($doc[12])) {
            $invoiceBillet->commercial_percentage = $doc[12];
            $commissionCommercialValue = $billetDiscounted ?? $invoiceBillet->discounted_price;
            $commissionCommercial = ($doc[12] / 100) * $commissionCommercialValue;
            $invoiceBillet->commercial_commission = $commissionCommercial;
        }
        if (!empty($doc[13])) {
            $invoiceBillet->commercial_commission = $commissionCommercial;
        }

        if (!empty($doc[3])) {
            $invoiceBillet->paid_commission = Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[3] - 2)->addMonth(1)
                ->format('Y-m-d H:i:s');
            $invoiceBillet->paid_commercial = Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[3] - 2)->addMonth(2)
                ->format('Y-m-d H:i:s');
        } else if (!empty($doc[2])) {
            $invoiceBillet->paid_commission = Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[2] - 2)->addMonth(1)
                ->format('Y-m-d H:i:s');
            $invoiceBillet->paid_commercial = Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($doc[2] - 2)->addMonth(2)
                ->format('Y-m-d H:i:s');
        }
        if (!empty($doc[3])) {
            $invoiceBillet->paid_at = $billetPaidAt;
        }
        if (!empty($billetObs)) {
            $invoiceBillet->observation = $billetObs;
        }
        $user = auth()->user();

        InvoiceLog::create([
            'user_id' => $user->id,
            'invoice_id' => $invoice->id,
            'mod' => "Baixa da nota $billetNumber feita via importação excel",
        ]);

        $invoiceBillet->update();

    }

    /* protected function createInvoice(
        Order $order,
        $doc
    ): Invoice {
        $installmentRules = explode('/', $doc[10]);
        $countInstallment = count($installmentRules);

        $invoice = Invoice::create([
            'number' => $doc[6] ?? $order->code,
            'issuance_date' => Carbon::parse($doc[8]) ?? now()->format('Y-m-d 00:00:00'),
            'value' => $doc[7] ?? $order->total_value,
            'term_payment' => $doc[10] ?? $order->installment_rule,
            'observation' => $doc[15] ?? null,
            'term_qty' => $countInstallment ?? 1,
            'commission' => ($doc[11] ?? 0 / 100) * ($doc[12] ?? 0),
            'percentage_commission' => $doc[11] ?? 0,
            'commercial_commission' => ($doc[13] ?? 0 / 100) * ($doc[14] ?? 0),
            'commercial_percentage' => $doc[13] ?? 0,
            'order_status_id' => optional($order->orderStatuses()->first())->id,
            'order_id' => $order->id,
        ]);

        if ($order->current_status !== 'billed') {
            OrderStatus::create([
                'name' => 'billed',
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
        );

        return $invoice;
    } */

    protected function formatDocument(string $document)
    {
        $document = preg_replace("/\D/", '', $document);

        return preg_replace("/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/", "\$1.\$2.\$3/\$4-\$5", $document);
    }

    protected function numberFormatted($doc, $supplier)
    {
        $billet = $doc[5];

        if (empty($doc[5])) {
            if (preg_match('/[.\/-]/', $doc[4])) {
                $parts = preg_split('/[.\/-]/', $doc[4]);
                $part1 = $parts[0];
                $part2 = isset($parts[1]) ? ltrim($parts[1], '0') : 1;
                $billet = $part2;
            } elseif (preg_match('/\d+[A-Za-z]$/', $doc[4])) {
                preg_match('/(\d+)([A-Za-z])/', $doc[4], $matches);
                $part1 = $matches[1];
                $letter = $matches[2];
                $billet = $part1;
                $letra = $letter;
            }
        }

        // FORMATO DE PARCELA DA REVAL
        if ($supplier->id == 50 || $supplier->id == 4) {
            $map = [
                'A' => 1,
                'B' => 2,
                'C' => 3,
                'D' => 4,
                'E' => 5,
                'F' => 6,
                'G' => 7,
                'H' => 8,
                'I' => 9,
                'J' => 10,
                'K' => 11,
                'L' => 12,
                'M' => 13,
                'N' => 14,
                'O' => 15,
                'P' => 16,
                'Q' => 17,
                'R' => 18,
                'S' => 19,
                'T' => 20,
            ];

            $key = strtoupper($billet);

            if (isset($map[$key])) {
                return $map[$key];
            }
        }
        // FORMATO DE PARCELA DA CIRANDA CULTURAL
        if ($supplier->id == 24) {
            $map = [
                'AAA' => 1,
                'AAB' => 2,
                'AAC' => 3,
                'AAD' => 4,
                'AAE' => 5,
                'AAF' => 6,
                'AAG' => 7,
                'AAH' => 8,
                'AAI' => 9,
                'AAJ' => 10,
                'AAK' => 11,
                'AAL' => 12,
                'AAM' => 13,
                'AAN' => 14,
                'AAO' => 15,
                'AAP' => 16,
                'AAQ' => 17,
                'AAR' => 18,
                'AAS' => 19,
                'AAT' => 20,
            ];

            $key = strtoupper($billet);

            if (isset($map[$key])) {
                return $map[$key];
            }
        }

        return $billet;
    }

    public function invoiceBilletsDownload()
    {
        $fileUrl = 'https://augeapp.com.br/xlsxModel/modeloTitulo.xlsx';

        // Usar file_get_contents para buscar o arquivo diretamente da URL
        $fileContents = file_get_contents($fileUrl);

        if ($fileContents === false) {
            return response()->json(['error' => 'Arquivo não encontrado'], 404);
        }

        // Definir o nome do arquivo para download
        $fileName = 'modeloTitulo.xlsx';

        // Retornar o arquivo para download
        return response($fileContents)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    }


}
