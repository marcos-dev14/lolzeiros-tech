<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $activityStart = $this->client?->activity_start;
        if (!empty($activityStart) && !$activityStart instanceof Carbon) {
            $activityStart = Carbon::createFromFormat('Y-m-d', $this->client?->activity_start);
        }

        $clientName = !empty($this->client?->company_name) ? $this->client?->company_name : $this->client?->name;

        return [
            'code' => $this->code,
            'old_id' => $this->old_id,
            'current_status' => $this->current_status,
            'statuses' => OrderStatusResource::collection($this->orderStatuses),
            'date' => $this->created_at->toIso8601String(),
            'formated_date' => $this->created_at->format('d/m/Y H:i'),
            'lead_time' => $this->lead_time,
            'supplier_name' => $this->product_supplier_name,
            'order_type_id' => $this->type?->id,
            'order_type' => $this->type?->name,
            'shipping_company' => new ShippingCompanyResource($this->shippingCompany),
            'installments' => $this->installment_rule ?? 'Não informado',
            'installment_rule_value' => $this->installment_rule_value,
            'fractional_box' => (bool) $this->fractional_box,
            'profile_discount' => $this->profile_discount,
            'country_state_icms' => $this->icms, // TODO Michel irá verificar
            'payment_promotion_term_start' => $this->payment_promotion_term_start,
            'voucher' => null,
            'voucher_discount' => null,
            'total_value' => (float) $this->total_value,
            'total_value_with_ipi' => (float) $this->total_value_with_ipi,
            'total_discount' => (float) $this->total_discount,
            'getTotalValue' => $this->getTotalValue(),
            'getTotalValueWithIpi' => $this->getTotalValueWithIpi(),
            'coupon_discount_value' => $this->coupon_discount_value,
            'coupon_discount_value_ipi' => $this->coupon_discount_value_ipi,
            'installment_discount_value' => $this->installment_discount_value,
            'installment_discount_value_ipi' => $this->installment_discount_value_ipi,
            'origin' => $this->origin,
            'quantities' => "$this->count_products produtos, $this->count_sum_products peças no total",
            'comments' => $this->comments,
            'internal_comments' => $this->internal_comments,
            'coupon' => $this->coupon->name ?? 'Sem Cupom',

            'client_document' => $this->client?->document,
            'client_name' => $clientName,
            'client_state_registration' => $this->client?->state_registration,
            'client_group' => $this->client?->group?->id,
            'client_code' => $this->client?->code,
            'client_status' => $this->client?->document_status,
            'client_commercial_status' => $this->client?->commercial_status,
            'client_activity_start' => $this->client?->activity_start,
            'client_formated_activity_start' => $activityStart?->format('d/m/Y'),
            'client_pdv_name' => $this->client?->pdvType?->name,
            'client_last_order' => $this->client_last_order,

            'buyer_name' => $this->buyer_name,
            'buyer_email' => $this->buyer_email,
            'buyer_cellphone' => $this->buyer_cellphone,
            'address_street' => $this->address_street,
            'address_number' => $this->address_number,
            'address_complement' => $this->address_complement,
            'address_district' => $this->address_district,
            'address_city' => $this->address_city,
            'address_zipcode' => $this->address_zipcode,
            'address_state' => $this->address_state,
            'seller' => new SellerResource($this->seller),
            'sale_channel_id' => $this->sale_channel_id,
            'sale_channel' => new JustNameResource($this->saleChannel),
            'download' => route('buyer.downloadPDF', $this->code) . '?internal=1',
            'products' => OrderProductResource::collection($this->products),

            'external_order_id' => $this->external_order_id,
            'external_created_at' => $this->external_created_at,
        ];
    }
}
