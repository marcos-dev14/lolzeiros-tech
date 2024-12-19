<?php

namespace App\Observers;

use App\Models\Supplier;

class SupplierObserver
{
    public function creating(Supplier $supplier)
    {
        $supplier->code = makeUniqueHashFromModel($supplier, 'code', 6, true);
    }
}
