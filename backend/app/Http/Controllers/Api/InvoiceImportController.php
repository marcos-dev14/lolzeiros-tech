<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceLog;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Supplier;
use App\Services\InvoiceBilletService;
use App\Services\InvoiceLogService;
use App\Services\InvoiceService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;
use Saloon\XmlWrangler\Exceptions\XmlReaderException;
use Saloon\XmlWrangler\XmlReader;
use stdClass;
use Throwable;

class InvoiceImportController extends BaseController
{
    public function __construct(
        public InvoiceService $invoiceService,
        public InvoiceBilletService $invoiceBilletService,
        public InvoiceLogService $invoiceLogService
    ) {}

    /**
     * @throws Throwable
     * @throws XmlReaderException
     */
    public function byXml(Request $request)
    {
        if (!$request->hasFile('xml')) {
            return $this->sendError('Arquivo XML não encontrado.', [], 400);
        }

        $xmlFile = XmlReader::fromFile($request->file('xml'));
        $xmlFile = $this->arrayToObject($xmlFile->values());

        $nfe = $xmlFile->nfeProc?->NFe;
        $nfeInfo = $nfe->infNFe;
        $nfeOrderCode = $nfe->infNFe->compra?->xPed ?? NULL;
        $orderCode = NULL;
        $suppierId = $request->id;

        if ($nfeOrderCode) {
            if (strpos($nfeOrderCode, '/') !== false) {
                $orderCode = explode('/', $nfeOrderCode)[1];
            } elseif (preg_match('/[a-zA-Z]/', $nfeOrderCode)) {
                $orderCode = $nfeOrderCode;
            }
        }

        if ($request->orderCode) {
            $orderCode = $request->orderCode;
        }

        try {
            $nfeSupplierData = $nfeInfo->emit;
            $nfeClientData = $nfeInfo->dest;
            $nfeDate = $nfeInfo->ide->dhEmi;
            $nfeNumber = $nfeInfo->ide->nNF;
            $nfeValue = $nfeInfo->total->ICMSTot->vProd;
            $nfeValueWithTax = $nfeInfo->total->ICMSTot->vProd;

            $suppier = Supplier::where('id', $suppierId)->first();
            $client = $this->getClientFromDocument($nfeClientData->CNPJ);

            $orders = $this->getOrder($orderCode, $nfeDate, $nfeValue, $client, $suppier);
            if ($orders->count() > 1) {
                $formattedOrders = $orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'code' => $order->code,
                        'status' => $order->current_status,
                        'date' => $order->created_at,
                        'value' => $order->total_value,
                        'to_be_invoiced' => $order->total_value - ($order->invoiced_value ?? 0),
                        'shipping_number' => $order->shippingCompany->document ?? 'Sem Documento',
                    ];
                });

                return response()->json([
                    'message' => "Foram encontradas as seguintes vendas:",
                    'orders' => $formattedOrders
                ]);
            }

            if (
                //                true
                $this->canProceed($orderCode, $orders, $nfeNumber, $nfeValue) == 'OK'
            ) {
                //               $nfeInstallments = is_array($nfeInfo->cobr->dup) ? $nfeInfo->cobr->dup : [];
                $nfeInstallments = is_array($nfeInfo->cobr->dup) ? $nfeInfo->cobr->dup : [$nfeInfo->cobr->dup];
                $nfeDate = Carbon::parse($nfeInfo->ide->dhEmi);

                $invoice = $this->createInvoice(
                    $orders->first(),
                    $nfeInstallments,
                    $nfeNumber,
                    $nfeValue,
                    $nfeValueWithTax,
                    $nfeDate
                );
                $this->createInvoiceBillets(
                    $invoice,
                    $nfeInstallments,
                    ($nfeValue / count($nfeInstallments))
                );
            } else {
                return $this->canProceed($orderCode, $orders, $nfeNumber, $nfeValue);
            }
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [], $exception->getCode());
        }

        $user = auth()->user();

        InvoiceLog::create([
            'user_id' => $user->id,
            'invoice_id' => $invoice->id,
            'mod' => 'Fatura Gerada via importação xml',
        ]);

        return response()->json([
            'message' => "Nota faturada {$invoice->number} com sucesso.",
            'invoice' => $invoice->id,
        ], 200);
    }

    /**
     * @throws Throwable
     */
    protected function canProceed(
        ?string $orderCode,
        Collection $orders,
        string $nfeNumber,
        float $nfeValue
    ) {
        throw_if(!$orders->count(), new Exception('Não foi encontrado nenhum pedido para este faturamento, inclua o pedido e depois volte para faturar.', 404));

        if ($orders->count() > 1) {
            $formattedOrders = $orders->map(function ($order) {
                return [
                    'code' => $order->code,
                    'date' => $order->created_at,
                    'value' => $order->total_value,
                ];
            });
            throw new Exception(
                json_encode([
                    'message' => "Foram encontradas as seguintes vendas:",
                    'orders' => $formattedOrders,
                ]),
                400
            );
        }

        $order = $orders->first();
        $ordersValidates = Order::with('invoices')
            ->where('product_supplier_id', $order->supplier->id)
            ->get();

        foreach ($ordersValidates as $ordersValidate) {
            $invoiceCount = $ordersValidate->invoices->where('number', $nfeNumber)->count();

            if ($order->code == $ordersValidate->code) { 
                throw_if(
                    $invoiceCount >= 1,
                    new Exception(
                        "A nota de número $nfeNumber já foi faturada anteriormente", // Mesma nota para o mesmo pedido
                        202
                    )
                );
            } else {
                throw_if(
                    $invoiceCount >= 1,
                    new Exception(
                        "A nota de número $nfeNumber já foi faturada anteriormente neste fornecedor", // Mesma nota para outro pedido do mesmo fornecedor
                        202
                    )
                );
            }
        }


        $this->destroyAutoGeneratedInvoice($order);
        //if ($orderCode == null) {
            $invoicedValue = $order->invoiced_value;
            $orderTotal = $order->total_value;
            $invoicedDiff = $orderTotal - $invoicedValue;
            if ($invoicedDiff < $nfeValue) {
                return $this->returnSum($order, $invoicedDiff, $nfeValue);
            }
            /* throw_if(
                $invoicedDiff < $nfeValue,
                new Exception(
                    "Resta apenas R$ " . formatMoney($invoicedDiff) . " para ser faturado, mas a nota enviada tem valor de R$ " . formatMoney($nfeValue),
                    400
                )

            ); */
        //}
        return 'OK';
    }

    public function returnSum($order, $invoicedDiff, $nfeValue)
    {
        return response()->json([
            'message' => "O saldo disponível para faturamento do pedido da " . $order->client->company_name ?? $order->client->name . ", CNPJ " . $order->client->document . "é de " . formatMoney($invoicedDiff) . ", mas o XML a ser importado é de R$" . formatMoney($nfeValue) . ". Deseja prosseguir mesmo assim?",
            // "Resta apenas R$ " . formatMoney($invoicedDiff) . " para ser faturado, mas a nota enviada tem valor de R$ " . formatMoney($nfeValue),
            'code' => $order->code,
            'date' => $order->created_at,
            'value' => $order->total_value,
            'shipping_number' => $order->shippingCompany->document ?? 'Sem Documento',
            'to_be_invoiced' => $order->total_value - ($order->invoiced_value ?? 0),
        ]);
    }

    protected function extractTermDayFromInstallments(array $installments): ?int
    {
        $days = array_count_values(array_map(function ($installment) {
            return Carbon::parse($installment->dVenc)->day;
        }, $installments));

        return array_search(max($days), $days);
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
        ?string $orderCode,
        string $date,
        ?string $value,
        ?Client $client,
        ?Supplier $supplier
    ) {
        $query = Order::with('invoices', 'client');
        if (!empty($orderCode)) {
            $query->where('code', $orderCode)
                ->orWhere('external_order_id', $orderCode);
        } else {
            /* $query->where(function ($query) use ($value) {
                $query->whereRaw('invoiced_value <= total_value_with_ipi')
                    ->orWhere('invoiced_value', 0)
                    ->orWhereNull('invoiced_value');
            }); */

            $date = Carbon::parse($date);
            $dateBefore = $date->clone()->addMonth(-3);
            $query->whereBetween('created_at', [$dateBefore, $date->addDays(7)]);

            $value = $value - ($value * 0.1);

            /* if (!empty($value)) {
                $query->where('total_value_with_ipi', '>=', $value);
            } */

            $query->where('current_status', '!=', 'canceled');

            if (!empty($supplier)) {
                $query->where('product_supplier_id', $supplier->id);
            }

            if (!empty($client)) {
                $query->where('client_id', $client->id);
            }
        }

        return $query->get();
    }

    protected function createInvoiceBillets(
        Invoice $invoice,
        array $installments,
        float $commissionBaseValue
    ) {
        foreach ($installments as $key => $installment) {
            $this->invoiceBilletService->make(
                $this->invoiceBilletService->getMakeData(
                    count: $key + 1,
                    invoice: $invoice,
                    dueDate: Carbon::parse($installment->dVenc),
                    commissionBaseValue: $commissionBaseValue,
                    value: $installment->vDup
                )
            );
        }
    }

    protected function createInvoice(
        Order $order,
        array $installments,
        string $number,
        float $value,
        float $commissionBaseValue,
        Carbon $nfeDate
    ): Invoice {
        $invoice = $this->invoiceService->make(
            $this->invoiceService->getMakeData(
                order: $order,
                installmentQuantity: count($installments) ?? 1,
                installments: $installments,
                number: $number,
                issuance: $nfeDate,
                commissionBaseValue: $value,
                value: $commissionBaseValue,
                termDay: $this->extractTermDayFromInstallments($installments)
            )
        );

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

    protected function getClientFromDocument(string $document)
    {
        $document = $this->formatDocument($document);
        return Client::with('orders')->where('document', $document)->isAvailable()->first();
    }

    /* protected function getSupplier(string $document, string $name)
    {
        $document = $this->formatDocument($document);

        $firstName = explode(' ', $name)[0];

        return Supplier::isAvailable()
            ->where(function ($query) use ($document, $firstName, $name) {
                $query->where('document', $document)
                    ->orWhere('company_name', 'like', "%$name%")
                    ->orWhere('company_name', 'like', "%$firstName%")
                    ->orWhere('name', 'like', "%$firstName%");
            })
            ->first();
    } */

    protected function formatDocument(string $document)
    {
        $document = preg_replace("/\D/", '', $document);

        return preg_replace("/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/", "\$1.\$2.\$3/\$4-\$5", $document);
    }

    protected function arrayToObject($props, $preserve_array_indexes = false)
    {
        $obj = new stdClass();

        if (!is_array($props)) {
            return $props;
        }

        foreach ($props as $key => $value) {
            if (is_numeric($key) && !$preserve_array_indexes) {
                if (!is_array($obj)) {
                    $obj = [];
                }

                $obj[] = $this->arrayToObject($value);
                continue;
            }

            $obj->{$key} = is_array($value) ? $this->arrayToObject($value) : $value;
        }

        return $obj;
    }
}
