<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\FinanceOrderResource;
use App\Models\Invoice;
use App\Models\InvoiceLog;
use App\Models\OrderStatus;
use App\Services\InvoiceBilletService;
use App\Services\InvoiceLogService;
use App\Services\InvoiceService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use App\Models\Order;
use App\Models\InvoiceBillet;
use App\Models\PdfImports;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Lang;
use Throwable;

class InvoiceController extends BaseController
{
    public function __construct(
        public InvoiceService $invoiceService,
        public InvoiceBilletService $invoiceBilletService,
        public InvoiceLogService $invoiceLogService
    ) {

    }

    public function all()
    {
        $invoices = Invoice::all();
        return response()->json(['invoices' => $invoices]);
    }

    public function index(Invoice $invoice)
    {
        $order = $invoice->order;
        $noInvoicedValue = $order->total_value - $order->invoiced_value;
        $products = $order->products;
        $totalProductsQty = $products->sum('qty');
        $discountNotPaidBillets = 0;
        $discountPaidBillets = 0;
        $billetValue = 0;
        $client = $order->client;
        $clientProfile = $client->profile;
        $supplier = $order->supplier;
        $invoicesLogs = $invoice->invoicesLogs;
        foreach ($invoicesLogs as $invoiceLog) {
            $user = $invoiceLog->user;
        }


        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $billets = $invoice->invoiceBillets;
        $statuses = [];
        $checkValue = 0;
        $discountBillets = 0;

        $discount = [
            'auge' => $supplierDiscount?->auge_commission ?? 0,
            'commercial' => $supplierDiscount?->commercial_commission ?? 0,
        ];

        foreach ($billets as $billet) {
            if ($billet->paid_at !== null) {
                $discountPaidBillets += $billet->discount;
                if ($billet->discounted_price !== null && $billet->discounted_price != 0) {
                    $billetValue += $billet->discounted_price;
                    $checkValue = $billetValue;
                } else {
                    $billetValue += $billet->value;
                    $checkValue = $billetValue + $discountPaidBillets;
                }
            }


            if ($billet->paid_at == null) {
                $discountNotPaidBillets += $billet->discount;
            }

            $discountBillets += $billet->discount;
        }

        $paidValue = $invoice->value - $checkValue + $discountNotPaidBillets;

        return response()->json([
            'totalProductsQty' => $totalProductsQty,
            'invoice' => $invoice,
            'checkValue' => $checkValue,
            'paidValue' => $paidValue,
            'noInvoicedValue' => $noInvoicedValue,
            'discountOrder' => $discount,
            'discountBillets' => $discountBillets
        ]);
    }

    public function create(Order $order)
    {
        $user = auth()->user();
        if ($order->current_status !== 'billed') {
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);
            $order->current_status = 'billed';
        }

        if ($order->invoiced_value == null && $order->invoiced_value == 0) {
            $order->invoiced_value = $order->invoiced_value + $order->total_value;
            $sum = $order->total_value;
        } else {
            $sum = $order->total_value - $order->invoiced_value;
            $order->invoiced_value = $order->invoiced_value + $sum;
        }

        $order->update();

        $supplier = $order->supplier;
        $client = $order->client;
        $clientProfile = $client->profile;
        $status = $order->orderStatuses()->first();
        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();
        $augeCommission = ($supplierDiscount?->auge_commission / 100) * $order->total_value;
        $commercialCommission = ($supplierDiscount?->commercial_commission / 100) * $order->total_value;
        $installmentRules = explode('/', $order->installment_rule);
        $countInstallment = count($installmentRules);
        $billetsValuePercentage = $order->total_value / $countInstallment;
        $augeBilletsCommission = ($supplierDiscount?->auge_commission / 100) * $billetsValuePercentage;
        $commercialBilletsCommission = ($supplierDiscount?->commercial_commission / 100) * $billetsValuePercentage;
        $dataDay = Carbon::now()->format('Y-m-d 00:00:00');
        $invoices = Invoice::create([

            'order_id' => $order->id,
            'issuance_date' => $dataDay,
            'value' => $sum,
            'term_payment' => $order->installment_rule,
            'term_qty' => $countInstallment,
            'commission' => $augeCommission ?? 0,
            'percentage_commission' => $supplierDiscount?->auge_commission ?? 0,
            'commercial_commission' => $commercialCommission ?? 0,
            'commercial_percentage' => $supplierDiscount?->commercial_commission ?? 0,
            'order_status_id' => $status->id,
        ]);

         InvoiceLog::create([
            'user_id' => $user->id,
            'invoice_id' => $invoices->id,
            'mod' => 'Fatura Gerada Automatica',
        ]);

        $startDate = Carbon::now();
        if ($installmentRules['0'] == 60) {
            $dueDate = $startDate->addDays(30);
        }

        if ($countInstallment > 0) {
            for ($i = 0; $i < $countInstallment; $i++) {
                $dueDate = $startDate->addDays(30);
                $augeDate = Carbon::parse($dueDate)->addMonth(1);
                $commercialDate = Carbon::parse($dueDate)->addMonth(2);

                $billets = InvoiceBillet::create([
                    'number' => $order->code,
                    'invoice_id' => $invoices->id,
                    'due_date' => $dueDate,
                    'value' => $sum / $countInstallment,
                    'commission' => $augeBilletsCommission ?? 0,
                    'paid_commission' => $augeDate,
                    'paid_commercial' => $commercialDate,
                    'percentage_commission' => $supplierDiscount?->auge_commission ?? 0,
                    'commercial_commission' => $commercialBilletsCommission ?? 0,
                    'commercial_percentage' => $supplierDiscount?->commercial_commission ?? 0,
                    'invoice_billet_status_id' => 1,
                ]);
            }
        }



        return response()->json(['message' => 'Invoice criado!.']);
    }

    public function free(Request $request, Order $order)
    {
        $user = auth()->user();
        Validator::make($request->all(), [
            'issuance_date' => 'required',
            'number' => 'required',
            'value' => 'required',
            'term_qty' => 'required',
            'percentage_commission' => 'required',
            'commercial_percentage' => 'required',
            'term_day' => 'required',
            'first' => 'required'
        ]);

        if ($order->current_status !== 'billed') {
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);
            $order->current_status = 'billed';
        }

        //$order->invoiced_value = $order->invoiced_value + $request->value;
        //$order->update();

        $termStart = 0;
        if ($request->term_payment == null) {
            $countInstallment = $request->term_qty;

            for ($i = 0; $i < $request->term_qty; $i++) {
                $termPayment = $termStart + $request->term_day;
                $termPayments[] = $termPayment;
                $termStart = $termPayment;
            }

            $termPaymentsString = implode('/', $termPayments);
        } else {
            $installmentRules = explode('/', $request->term_payment);
            $countInstallment = count($installmentRules);
        }

        $verifyInvoices = Invoice::where('number', $request->number)->get();
        if ($verifyInvoices->isNotEmpty()) {
            foreach ($verifyInvoices as $verifyInvoice) {
                $supplier = $verifyInvoice->order->product_supplier_id;
                if ($supplier == $order->supplier->id) {
                    return response()->json(['message' => 'Ja existe uma Fatura com esse nome para o mesmo fornecedor!.']);
                }
            }
        }

        $invoice = Invoice::create([
            'order_id' => $order->id,
            'issuance_date' => $request->issuance_date,
            'number' => $request->number,
            'value' => $request->value,
            'term_payment' => $termPaymentsString ?? null,
            'term_qty' => $countInstallment,
            'term_day' => $request->term_day ?? null,
            'commission' => (($request->percentage_commission / 100) * $request->value) ?? 0,
            'percentage_commission' => $request->percentage_commission ?? 0,
            'commercial_commission' => (($request->commercial_percentage / 100) * $request->value) ?? 0,
            'commercial_percentage' => $request->commercial_percentage ?? 0,
            'order_status_id' => $order->orderStatuses()->first()?->id,
        ]);

        $this->invoiceLogService->make(
            $this->invoiceLogService->getMakeData(
                invoice: $invoice,
                logMessage: 'Fatura Gerada Livre'
            )
        );

        $firstPaymentDate = $request->first;
        $startDate = now()->addDays($firstPaymentDate);
        if ($countInstallment > 0) {
            for ($i = 0; $i < $countInstallment; $i++) {
                $dueDate = $i > 0 ? $startDate->addDays($request->term_day) : $startDate;
                $count = $i;
                $this->invoiceBilletService->make(
                    $this->invoiceBilletService->getMakeData(
                        count: $count,
                        invoice: $invoice,
                        dueDate: $dueDate,
                        commissionBaseValue: ($request->value / $countInstallment),
                        value: ($request->value / $countInstallment)
                    )
                );
            }
        }

        return response()->json(['message' => 'Invoice criado!.']);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $user = auth()->user();
        $mod = [];
        if ($request->value !== null) {
            $order = $invoice->order;
            if ($order->invoiced_value >= $invoice->value) {
                $restoreValue = $order->invoiced_value - $invoice->value;
                $order->invoiced_value = $request->value + $restoreValue;
                $order->update();
            }

            if ($order->invoiced_value < 0) {
                $invoiceList = $order->invoices;
                $sum = 0;

                foreach ($invoiceList as $item) {
                    $sum += $item->value;
                }

                $order->invoiced_value = $sum;
                $order->update();
            }


            $invoice->commission = $request->value / 100 * $invoice->percentage_commission;
            $invoice->commercial_commission = $request->value / 100 * $invoice->commercial_percentage;
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);
            $countBillets = $invoice->invoiceBillets->count();

            foreach ($unpaidBillets as $billet) {
                $billet->value = $request->value / $countBillets;
                $billet->commission = $billet->value / 100 * $billet->percentage_commission;
                $billet->commercial_commission = $billet->value / 100 * $billet->commercial_percentage;
                $billet->update();
            }

            $invoice->value = $request->value;
            $mod[] = "Valor Modificado";
        }

        if ($request->auge !== null) {
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);
            $countBillets = $invoice->invoiceBillets->count();

            foreach ($unpaidBillets as $billet) {
                $billet->value = $invoice->value / $countBillets;
                $billet->commission = $billet->value / 100 * $request->auge;
                $billet->percentage_commission = $request->auge;
                $billet->update();
            }

            $invoice->percentage_commission = $request->auge;
            $new = $request->auge / 100 * $invoice->value;
            $invoice->commission = $new;

            if ($request->value !== null) {
                $new = $request->auge / 100 * $request->value;
                $invoice->commission = $new;
            }
            $mod[] = "Porcentagem Auge Modificada";
        }

        if ($request->comercial !== null) {
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);

            $countBillets = $invoice->invoiceBillets->count();

            foreach ($unpaidBillets as $billet) {
                $billet->value = $invoice->value / $countBillets;
                $billet->commercial_commission = $billet->value / 100 * $request->comercial;
                $billet->commercial_percentage = $request->comercial;
                $billet->update();
            }

            $invoice->commercial_percentage = $request->comercial;
            $newCommercial = $request->comercial / 100 * $invoice->value;
            $invoice->commercial_commission = $newCommercial;

            if ($request->value !== null) {
                $newCommercial = $request->comercial / 100 * $request->value;
                $invoice->commercial_commission = $newCommercial;
            }

            $mod[] = "Porcentagem Comercial Modificada";
        }

        if ($request->obs !== null) {
            $invoice->observation = $request->obs;

            $mod[] = "Observação Modificada";
        }

        if ($request->number !== null) {
            $order = $invoice->order;
            $verifyInvoices = Invoice::where('number', $request->number)->get();
            if ($verifyInvoices->isNotEmpty()) {
                foreach ($verifyInvoices as $verifyInvoice) {
                    $supplier = $verifyInvoice->order->product_supplier_id;
                    if ($supplier == $invoice->order->supplier->id) {
                        return response()->json(['message' => 'Ja existe uma Fatura com esse nome para o mesmo fornecedor!.']);
                    }
                }
            }

            $invoice->number = $request->number;
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);

            $count = 0;
            foreach ($unpaidBillets as $key => $billet) {
                $billet->number = $request->number . ' - ' . $key + 1;
                $billet->update();
                $count++;
            }

            $mod[] = "Numero de Nf Modificado";
        }

        if ($request->issuance_date !== null) {
            $invoice->issuance_date = $request->issuance_date;
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);
            $installmentRules = explode('/', $invoice->term_payment);
            $countInstallment = count($installmentRules);
            $countBillet = 1;

            foreach ($unpaidBillets as $billet) {
                if ($countBillet >= 1) {
                    $installmentValue = is_int($installmentRules[0]) ? $installmentRules[0] : (int) $installmentRules[0];
                    $sumDueDate = $installmentValue * $countBillet;
                } else {
                    $sumDueDate = $installmentRules[0];
                }

                $dueDate = Carbon::parse($request->issuance_date)->addDays($sumDueDate);
                $augeDate = Carbon::parse($dueDate)->addMonths(1);
                $commercialDate = Carbon::parse($dueDate)->addMonths(2);


                $billet->paid_commission = $augeDate;
                $billet->paid_commercial = $commercialDate;
                $billet->due_date = $dueDate;
                $billet->update();
                $countBillet++;
            }

            $mod[] = "Data Modificada!";
        }

        if ($request->data_base !== null) {
            $invoice->data_base = $request->data_base;
            $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);
            $installmentRules = explode('/', $invoice->term_payment);
            $countInstallment = count($installmentRules);
            $countBillet = 1;

            foreach ($unpaidBillets as $billet) {
                $sumDueDate = ($countBillet >= 1) ? $installmentRules[0] * $countBillet : $installmentRules[0];

                $dueDate = Carbon::parse($request->data_base)->addDays($sumDueDate);
                $augeDate = Carbon::parse($dueDate)->addMonths(1);
                $commercialDate = Carbon::parse($dueDate)->addMonths(2);

                $billet->paid_commission = $augeDate;
                $billet->paid_commercial = $commercialDate;
                $billet->due_date = $dueDate;
                $billet->update();
                $countBillet++;
            }

            $mod[] = "Data Base Modificada";
        }

        if ($request->status !== null) {
            $invoice->status = $request->status;
            if($request->status == 2){
                $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);
                foreach ($unpaidBillets as $billet) {
                    $dueDate = Carbon::parse($billet->due_date);
                    $augeDate = Carbon::parse($dueDate)->addMonths(1);
                    $commercialDate = Carbon::parse($dueDate)->addMonths(2);

                    $billet->paid_commission = $augeDate;
                    $billet->paid_commercial = $commercialDate;
                    $billet->paid_at = $dueDate;
                    $billet->update();
                }
            };

            $mod[] = "Status Modificado";
        }

        $order = $invoice->order;

        if ($order->current_status !== 'billed') {
            OrderStatus::create([
                'name' => 'billed',
                'user_name' => $user->name,
                'order_id' => $order->id
            ]);
            $order->current_status = 'billed';
            $order->update();
        }

        $this->invoiceLogService->make(
            $this->invoiceLogService->getMakeData(
                invoice: $invoice,
                logMessage: implode(", ", $mod)
            )
        );

        $invoice->update();

        return response()->json(['message' => 'Operação bem-sucedida.']);
    }

    public function updateBillets(Request $request, Invoice $invoice)
    {
        try {
            $newInstallment = $request->installment;
            $firstPaymentDate = $request->first;

            $validator = Validator::make($request->all(), [
                'installment' => 'required|numeric',
                'term' => 'required|numeric',
                'first' => 'required|numeric'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $order = $invoice->order;
            $date = Carbon::now();
            $startDate = $date->addDays($firstPaymentDate);
            $value = $invoice->value;
            $client = $order->client;
            $clientProfile = $client->profile;
            $billets = $invoice->invoiceBillets;

            if ($billets->count() > 0) {
                $unpaidBillets = $invoice->invoiceBillets->where('paid_at', null);

                foreach ($unpaidBillets as $billet) {
                    $billet->delete();
                }

                $billetsPay = $invoice->invoiceBillets->whereNotNull('paid_at');

                if ($billetsPay->count() > 0) {
                    $billetsPaySumValue = $billetsPay->sum('value');
                    $value = $invoice->value - $billetsPaySumValue;
                    $augeCommission = ($invoice->percentage_commission / 100) * $value;
                    $commercialCommission = ($invoice->commercial_percentage / 100) * $value;
                    $invoice->value = $value;
                    $invoice->commission = $augeCommission ?? 0;
                    $invoice->commercial_commission = $commercialCommission ?? 0;
                    $invoice->save();
                }
            }

            $termStart = 0;

            if ($newInstallment > 0) {
                for ($i = 0; $i < $newInstallment; $i++) {
                    $termPayment = $termStart + $request->term;
                    $termPayments[] = $termPayment;
                    $termStart = $termPayment;
                }

                $termPaymentsString = implode('/', $termPayments);
                $invoice->term_payment = $termPaymentsString;
                $invoice->term_qty = $newInstallment;
                $invoice->term_day = $request->term;
                $invoice->save();

                $billetsValuePercentage = $value / $newInstallment;
                $augeBilletsCommission = ($invoice->percentage_commission / 100) * $billetsValuePercentage;
                $commercialBilletsCommission = ($invoice->commercial_percentage / 100) * $billetsValuePercentage;
                for ($i = 0; $i < $newInstallment; $i++) {
                    $dueDate = $i > 0 ? $startDate->addDays($request->term) : $startDate;

                    $augeDate = Carbon::parse($dueDate)->addMonth(1);
                    $commercialDate = Carbon::parse($dueDate)->addMonth(2);
                    $number = $invoice->number;
                    $count = $i;
                    if ($invoice->number == null) {
                        $number = $order->code;
                    }

                    InvoiceBillet::create([
                        'number' => $number . '-' . $count,
                        'invoice_id' => $invoice->id,
                        'due_date' => $dueDate,
                        'value' => $billetsValuePercentage,
                        'commission' => $augeBilletsCommission ?? 0,
                        'paid_commission' => $augeDate,
                        'paid_commercial' => $commercialDate,
                        'percentage_commission' => $invoice->percentage_commission ?? 0,
                        'commercial_commission' => $commercialBilletsCommission ?? 0,
                        'commercial_percentage' => $invoice->commercial_percentage ?? 0,
                        'invoice_billet_status_id' => 1,
                        'title_bearer' => 'Fornecedor',
                    ]);
                }
            }

            $this->invoiceLogService->make(
                $this->invoiceLogService->getMakeData(
                    invoice: $invoice,
                    logMessage: 'Atualização de Parcelas'
                )
            );

            return response()->json(['message' => 'Atualizado com sucesso', 'status' => 'success'], 200);
        } catch (\Exception $e) {
            //   \Log::error('Exceção capturada: ' . $e->getMessage());
            return response()->json(['mensagem' => 'Ocorreu um erro. Por favor, tente novamente mais tarde.'], 500);
        }
    }

    /**
     * @throws Throwable
     */
    public function delete(Invoice $invoice)
    {
        $order = $invoice->order;
        $order->loadMissing('invoices');
        //$invoice->loadMissing('invoiceBillets');

        //        if ($order->invoiced_value > 0) {
//            $order->invoiced_value = $order->invoiced_value - $invoice->value;
//            $order->update();
//        }
        //$billets = $invoice->invoiceBillets;

        //        if ($billets->whereNotNull('paid_at')->count() > 0) {
//            return response()->json(['message' => 'Não pode deletar pois tem boleto pago.'], 403);
//        }
        if ($order->invoices->count() == 1 && $order->current_status !== 'new') {
            $orderStatus = OrderStatus::where('order_id', $order->id)
                ->where('name', '!=', 'billed')
                ->orderBy('created_at', 'desc')
                ->first();

            if ($orderStatus) {
                $statusMapping = [
                    'Transmitido' => 'transmitted',
                    'Recebido' => 'received',
                    'Novo' => 'new',
                    'Faturado' => 'billed',
                    'Cancelado' => 'canceled',
                    'Pausado' => 'paused',
                ];

                if (isset($statusMapping[$orderStatus->name])) {
                    $order->current_status = $statusMapping[$orderStatus->name];
                }

                $order->update();
            }
        }

        try {
            $this->invoiceService->destroy($invoice);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $e->getCode());
        }
        //$invoice->delete();

        return response()->json(['message' => 'Invoice deletado.']);
    }

    public function export(Request $request, Order $order)
    {
        if ($order->invoice == null) {
            return response()->json(['message' => 'Invoice não existe!.']);
        }

        $clientGroup = $order->clientGroup;
        $supplier = $order->supplier;
        $products = $order->products;
        $totalProductsQty = $products->sum('qty');
        $seller = $order->seller;
        $orderStatus = $order->orderStatuses;
        $invoice = $order->invoice;
        $client = $order->client;
        $contact = $client->contacts->first();
        $billets = [];

        foreach ($invoice as $inv) {
            $billets[] = [
                'invoice' => $inv,
                'billets' => $inv->invoiceBillets,
                'statuses' => $inv->invoiceBillets->pluck('invoiceBilletstatus'),
            ];
        }

        $fileName = $order->code . '.pdf';
        $pdf = PDF::loadView('pdf.invoice', [
            'order' => $order,
            'billets' => $billets,
            'clientGroup' => $clientGroup,
            'supplier' => $supplier,
            'seller' => $seller,
            'orderStatus' => $orderStatus,
            'invoice' => $invoice,
            'totalProductsQty' => $totalProductsQty,
        ]);

        // Gere o nome do arquivo PDF
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isPhpEnabled' => true,
            'isHtml4ParserEnabled' => false,
            'isCssFloatEnabled' => false,
        ]);

        // Faça o download do PDF
        return $pdf->download($fileName);
    }

    public function exportInvoice(Invoice $invoice)
    {
        $pdf = PDF::loadView('pdf.billets', [
            'invoice' => $invoice,
        ]);

        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isPhpEnabled' => true,
            'isHtml4ParserEnabled' => false,
            'isCssFloatEnabled' => false,
        ]);

        // Faça o download do PDF
        return $pdf->download(
            "$invoice->number.pdf"
        );
    }

    public function import(Request $request, Invoice $invoice)
    {
        $request->validate([
            'pdf_file' => 'required',
        ]);

        $file = $request->file('pdf_file');

        try {
            $pdfPath = Storage::put("pdf/uploads/{$invoice->id}", $request->file('pdf_file'));
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $hashName = $request->file('pdf_file')->hashName();
            $mixedName = "{$originalName}_{$hashName}";

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
        }

        $pdf = new PdfImports();
        $pdf->fill([
            'name' => $mixedName,
            'invoice_id' => $invoice->id,
            'file_path' => $pdfPath
        ]);
        $pdf->save();

        return response()->json(['message' => 'importado!.']);
    }

    public function downloadPdf($id)
    {
        $pdf = PdfImports::findOrFail($id);
        $filePath = "pdf/uploads/{$pdf->invoice_id}/{$pdf->name}";

        if (!Storage::exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $fileContent = Storage::get($filePath);

        if (pathinfo($pdf->name, PATHINFO_EXTENSION) === 'pdf') {
            return response($fileContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $pdf->name . '"');
        }

        if (in_array(pathinfo($pdf->name, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif'])) {
            return response($fileContent)
                ->header('Content-Type', 'image/' . pathinfo($pdf->name, PATHINFO_EXTENSION))
                ->header('Content-Disposition', 'inline; filename="' . $pdf->name . '"');
        }

        return response()->json(['error' => 'Formato de arquivo não suportado'], 400);
    }

    public function deletePdf($id)
    {
        $pdf = PdfImports::findOrFail($id);
        $pdf->delete();

        return response()->json(['message' => 'deletado!.']);
    }

    protected function searchOrders(
        Builder $orders,
        ?string $searchTerm,
        ?string $supplierTerm,
        ?string $sellerTerm,
        ?string $dateStartTerm,
        ?string $dateEndTerm
    ): Builder {
        if (str_contains($searchTerm, "cliente: ")) {
            $searchTerm = trim(str_replace('cliente:', '', $searchTerm));
            $orders->byClientName($searchTerm);

            return $orders;
        }

        if (str_contains($searchTerm, "cnpj: ")) {
            $searchTerm = trim(str_replace('cnpj:', '', $searchTerm));
            $orders->byClientDocument($searchTerm);

            return $orders;
        }

        if (str_contains($searchTerm, "nfe: ")) {
            $searchTerm = trim(str_replace('nfe:', '', $searchTerm));

            $orders->whereHas('invoice', function ($query) use ($searchTerm) {
                $query->where('number', 'like', "%$searchTerm%");
            });

            return $orders;
        }

        if ($supplierTerm) {
            $orders->where('product_supplier_id', $supplierTerm);
        }

        if ($dateStartTerm) {
            $orders->where('created_at', '>', Carbon::parse($dateStartTerm)->format('Y-m-d 00:00:00'));
        }

        if ($dateEndTerm) {
            $orders->where('created_at', '<', Carbon::parse($dateEndTerm)->format('Y-m-d 23:59:59'));
        }

        if ($sellerTerm) {
            $orders->where('seller_id', $sellerTerm);
        }

        $searchTerm = trim(str_replace('codigo:', '', $searchTerm));
        $orders->where('code', 'like', "%$searchTerm%");
        return $orders;
    }

    public function orderslist(Request $request)
    {
        $paginated = $request->input('paginated');
        $searchTerm = $request->input('search');
        $supplierTerm = $request->supplier;
        $sellerTerm = $request->seller;
        $dateStartTerm = $request->dateStart;
        $dateEndTerm = $request->dateEnd;

        $orders = Order::query()->latest();

        if (!empty($searchTerm)) {
            $orders = $this->searchOrders($orders, $searchTerm, $supplierTerm, $sellerTerm, $dateStartTerm, $dateEndTerm);

            /* $orders = (!empty($paginated) && $paginated === 'true')
                ? $orders->paginate()
                : $orders->get(); */

            /* if ($orders instanceof LengthAwarePaginator) {
                return $this->sendResponse(
                    FinanceOrderResource::collection($orders)->response()->getData(),
                    Lang::get('custom.found_registers')
                );
            } */

            /* return $this->sendResponse(
                FinanceOrderResource::collection($orders),
                Lang::get('custom.found_registers')
            ); */
        }

        $orders = $this->applyCurrentStatusFilter($orders, $request);
        if ($supplierTerm) {
            $orders->where('product_supplier_id', $supplierTerm);
        }

        if ($dateStartTerm) {
            $orders->where('created_at', '>', Carbon::parse($dateStartTerm)->format('Y-m-d 00:00:00'));
        }

        if ($dateEndTerm) {
            $orders->where('created_at', '<', Carbon::parse($dateEndTerm)->format('Y-m-d 23:59:59'));
        }

        if ($sellerTerm) {
            $orders->where('seller_id', $sellerTerm);
        }

        $orders = (!empty($paginated) && $paginated === 'true')
            ? $orders->paginate()
            : $orders->get();

        if ($orders instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                FinanceOrderResource::collection($orders)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            FinanceOrderResource::collection($orders),
            Lang::get('custom.found_registers')
        );
    }

    protected function applyCurrentStatusFilter(Builder $query, Request $request): Builder
    {
        $availableFilters = [
            'New' => $request->input('only_new'),
            'received' => $request->input('only_received'),
            'transmitted' => $request->input('only_transmitted'),
            'canceled' => $request->input('only_canceled'),
            'paused' => $request->input('only_paused'),
        ];

        foreach ($availableFilters as $filter => $value) {
            if (!empty($value) && $value === 'true') {
                $query->where('current_status', $filter);

                return $query;
            }
        }

        $query->where('current_status', 'billed');

        return $query;
    }

    public function ordersShow(Order $order)
    {
        $order->loadMissing('invoice', 'type', 'shippingCompany', 'seller');
        $clientName = !empty($order->client?->company_name) ? $order->client?->company_name : $order->client?->name;
        $noInvoicedValue = $order->total_value - $order->invoiced_value;
        $supplier = $order->supplier;
        $client = $order->client;
        $clientProfile = $client->profile;

        $supplierDiscount = $supplier?->profileDiscounts()
            ->where('client_profile_id', $clientProfile?->id)
            ->first();

        $discount = [
            'auge' => $supplierDiscount?->auge_commission ?? 0,
            'commercial' => $supplierDiscount?->commercial_commission ?? 0,
        ];

        $countInstallment = '1';

        if ($order->installment_rule !== null) {
            $installmentRules = explode('/', $order->installment_rule);
            $countInstallment = count($installmentRules);
        }

        return response()->json([
            'order' => $order,
            'clientName' => $clientName,
            'discount' => $discount,
            'parcelas' => $countInstallment,
            'noInvoiceValue' => $noInvoicedValue
        ]);
    }
}
