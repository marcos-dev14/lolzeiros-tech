<?php

namespace App\Models\Traits;

use App\Models\Address;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @method morphMany(string $related, string $name, ?string $type = null, ?integer $id = null, ?string $localKey = null)
 */
trait HasAddresses
{
    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }
}
