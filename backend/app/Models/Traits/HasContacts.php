<?php

namespace App\Models\Traits;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @method morphMany(string $related, string $name, ?string $type = null, ?integer $id = null, ?string $localKey = null)
 */
trait HasContacts
{
    public function contacts(): MorphMany
    {
        return $this->morphMany(Contact::class, 'contactable');
    }
}
