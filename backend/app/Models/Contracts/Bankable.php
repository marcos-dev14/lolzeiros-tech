<?php

namespace App\Models\Contracts;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Bankable
{
    public function bankAccounts(): MorphMany;
}
