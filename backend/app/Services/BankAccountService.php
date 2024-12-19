<?php

namespace App\Services;

use App\Models\BankAccount;
use Illuminate\Database\Eloquent\Model;

class BankAccountService extends BaseService
{
    public function __construct()
    {
        $this->model = new BankAccount();
    }

    public function make(array $data): Model
    {
        $bankable = $data['bankable'];
        unset($data['bankable']);

        $newItem = $this->model->fill($data);
        $bankable->bankAccounts()->save($newItem);

        return $newItem;
    }
}
