<?php

namespace App\Observers;

use App\Models\Buyer;
use App\Models\ClientGroup;

class BuyerObserver
{
    public function deleting(Buyer $buyer)
    {
        $group = $buyer->group;

        if ($group instanceof ClientGroup && (empty($group->clients) || !$group->clients->count())) {
            $group->delete();
        }
    }
}
