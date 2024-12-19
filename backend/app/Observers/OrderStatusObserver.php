<?php

namespace App\Observers;

use App\Models\OrderStatus;

class OrderStatusObserver
{
    public function created(OrderStatus $orderStatus)
    {
        if ($orderStatus->name !== $orderStatus->statuses['new']) {
            $statusName = array_search($orderStatus->name, $orderStatus->statuses);
            $order = $orderStatus->order;

            $order->update(['current_status' => $statusName]);
        }
    }
}
