<?php

namespace App\Services;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ContactService extends BaseService
{
    public function __construct()
    {
        $this->model = new Contact();
    }

    public function make(array $data): Model
    {
        $contactable = $data['contactable'];
        unset($data['contactable']);

        $newItem = $this->model->fill($data);
        $contactable->contacts()->save($newItem);

        return $newItem;
    }
}
