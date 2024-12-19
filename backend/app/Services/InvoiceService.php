<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;
use Throwable;

class InvoiceService extends BaseService
{
    public function __construct()
    {
        $this->model = new Invoice();
    }

    public function getMakeData(
        Order $order,
        ?int $installmentQuantity = null,
        ?string $number = null,
        ?Carbon $issuance,
        ?array $installments,
        ?float $commissionBaseValue = null,
        ?float $value = null,
        ?int $termDay = null,
    ): array
    {
        $order->loadMissing('client.profile', 'supplier');

        $commissionBaseValue = $commissionBaseValue ?? $order->total_value;
        $supplierDiscount = $order->supplier?->profileDiscounts($order->client?->profile?->id)->first();

        $percentageCommission = $supplierDiscount?->auge_commission ?? 0;
        $commercialPercentageCommission = $supplierDiscount?->commercial_commission ?? 0;

        if (empty($installmentQuantity)) {
            $installmentRules = explode('/', $order->installment_rule);
            $installmentQuantity = count($installmentRules);
        }
        if($installments){
            $jsonString = json_encode($installments);
        }
        return [
            'number' => $number ?? $order->code,
            'issuance_date' => $issuance ?? now()->format('Y-m-d 00:00:00'),
            'value' => $value ?? $order->total_value,
            'term_payment' => $order->installment_rule,
            'observation' => $jsonString ?? null,
            'term_day' => $termDay,
            'term_qty' => $installmentQuantity ?? 1,
            'commission' => ($percentageCommission / 100) * $commissionBaseValue,
            'percentage_commission' => $percentageCommission ?? 0,
            'commercial_commission' => ($commercialPercentageCommission / 100) * $commissionBaseValue,
            'commercial_percentage' => $commercialPercentageCommission ?? 0,
            'order_status_id' => $order->orderStatuses()->first()?->id,
            'order_id' => $order->id,
        ];
    }

    /**
     * @throws Throwable
     */
    public function destroy(int|Model $item): void
    {
        $this->relations[] = 'invoiceBillets';

        if (is_int($item)) {
            $item = self::getById($item);
        }

        throw_if(!$item, ModelNotFoundException::class);

        throw_if(
            $item->invoiceBillets?->whereNotNull('paid_at')?->count() > 0,
            new Exception(
                'Não pode deletar pois tem boleto pago.',
                403
            )
        );

        $item->delete();
    }
}
