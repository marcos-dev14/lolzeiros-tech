<?php

namespace App\Models\Contracts;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Addressable
{
    public function addresses(): MorphMany;
}
