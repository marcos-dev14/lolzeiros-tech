<?php

namespace App\Models\Traits;

use App\Models\BankAccount;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @method morphMany(string $related, string $name, ?string $type = null, ?integer $id = null, ?string $localKey = null)
 */
trait HasBankAccounts
{
    public function bankAccounts(): MorphMany
    {
        return $this->morphMany(BankAccount::class, 'bankable');
    }
}
