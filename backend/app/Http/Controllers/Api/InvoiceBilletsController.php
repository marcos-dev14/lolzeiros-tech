<?php

namespace App\Http\Controllers\Api;

use App\Models\InvoiceBillet;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;


class InvoiceBilletsController extends BaseController
{
    public function all()
    {
        $invoiceBillet = InvoiceBillet::all();
        return response()->json(['billet' => $invoiceBillet]);
    }

    public function paidat()
    {
        $invoiceBillets = InvoiceBillet::whereNotNull('paid_at')
            ->orderByDesc('paid_at')
            ->get();
        return response()->json(['billet' => $invoiceBillets]);
    }

    public function index(InvoiceBillet $invoiceBillet)
    {
        return response()->json(['billet' => $invoiceBillet]);
    }

    public function paid(InvoiceBillet $invoiceBillet)
    {
        //dd($invoiceBillet->due_date);
        $date = $invoiceBillet->due_date;
        $mounth = Carbon::parse($date)->addMonth(1);
        $twoMounth = Carbon::parse($date)->addMonth(2);
        $invoiceBillet->paid_at = $date;
        $invoiceBillet->paid_commission = $mounth;
        $invoiceBillet->paid_commercial = $twoMounth;
        $invoiceBillet->invoice_billet_status_id = 2;
        $invoiceBillet->update();

        $countBillets = $invoiceBillet->invoice->invoiceBillets()->whereNull('paid_at')->count();

        if ($countBillets <= 1) {
            $invoiceBillet->invoice()->update(['status' => 2]);
        }

        return response()->json(['message' => 'Pagamento bem-sucedido.']);
    }

    public function unpaid(InvoiceBillet $invoiceBillet)
    {
        $date = Carbon::now();
        $invoiceBillet->paid_at = null;
        $invoiceBillet->invoice_billet_status_id = 1;
        $invoiceBillet->update();

        return response()->json(['message' => 'Pagamento removido.']);
    }

    public function update(Request $request, InvoiceBillet $invoiceBillet)
    {
        $invoice = $invoiceBillet->invoice;

        if ($request->discount !== null && $request->discount !== $invoiceBillet->discount) {
            $invoiceBillet->discount = $request->discount;
            $invoiceBillet->discounted_price = $invoiceBillet->value + $request->discount;
        }

        if ($request->obs !== null) {
            $invoiceBillet->observation = $request->obs;
        }

        if ($request->pay !== null && $request->pay !== $invoiceBillet->paid_at) {
            $invoiceBillet->paid_at = $request->pay;
            $mounth = Carbon::parse($request->pay)->addMonth(1);
            $twoMounth = Carbon::parse($request->pay)->addMonth(2);
            $invoiceBillet->paid_commission = $mounth;
            $invoiceBillet->paid_commercial = $twoMounth;
            $invoiceBillet->invoice_billet_status_id = 2;

            $countBillets = $invoiceBillet->invoice->invoiceBillets()->whereNull('paid_at')->count();

            if ($countBillets <= 1) {
                $invoiceBillet->invoice()->update(['status' => 2]);
            }

        }

        if ($request->auge !== null && $request->auge !== $invoiceBillet->percentage_commission) {

            $invoiceBillet->percentage_commission = $request->auge;

            if ($invoiceBillet->discount !== null) {
                $augeBilletsCommission = ($request->auge / 100) * $invoiceBillet->discounted_price;
            } else {
                $augeBilletsCommission = ($request->auge / 100) * $invoiceBillet->value;
            }

            $invoiceBillet->commission = $augeBilletsCommission;
        }

        if ($request->auge_date !== null && $request->auge_date !== $invoiceBillet->paid_commission) {
            $invoiceBillet->paid_commission = $request->auge_date;
        }

        if ($request->commercial !== null && $request->commercial !== $invoiceBillet->commercial_percentage) {
            $invoiceBillet->commercial_percentage = $request->commercial;

            if ($invoiceBillet->discount !== null) {
                $billetsCommission = ($request->commercial / 100) * $invoiceBillet->discounted_price;
            } else {
                $billetsCommission = ($request->commercial / 100) * $invoiceBillet->value;
            }

            $invoiceBillet->commercial_commission = $billetsCommission;
        }

        if ($request->commercial_date !== null && $request->commercial_date !== $invoiceBillet->paid_commercial) {
            $invoiceBillet->paid_commercial = $request->commercial_date;
        }

        if ($request->discounted_price !== null && $request->discounted_price !== $invoiceBillet->discounted_price) {

            $invoiceBillet->discounted_price = $request->discounted_price;
            $augeCommission = $invoiceBillet->discounted_price * ($invoiceBillet->percentage_commission / 100);
            $commercialCommission = $invoiceBillet->discounted_price * ($invoiceBillet->commercial_percentage / 100);
            $invoiceBillet->commission = $augeCommission;
            $invoiceBillet->commercial_commission = $commercialCommission;
        }

        if ($request->title_bearer !== null && $request->title_bearer !== $invoiceBillet->title_bearer) {
            $invoiceBillet->title_bearer = $request->title_bearer;
        }

        $invoiceBillet->update();

        return response()->json(['message' => 'Edição com sucesso.']);
    }
}
