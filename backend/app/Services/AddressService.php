<?php

namespace App\Services;

use App\Models\Address;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class AddressService extends BaseService
{
    public function __construct()
    {
        $this->model = new Address();
    }

    /**
     * @throws Throwable
     */
    public function make(array $data): Model
    {
        $addressable = $data['addressable'];
        unset($data['addressable']);

        if ($data['address_type_id'] == 1) {
            $countMainAddresses = $addressable->addresses()->mainAddress()->count();

            throw_if($countMainAddresses, new \Exception(
                'Apenas 1 endereço pode ser definido como principal',
                400
            ));
        }

        $newItem = $this->model->fill($data);
        $addressable->addresses()->save($newItem);

        return $newItem;
    }

    /**
     * @throws Throwable
     */
    public function update(int|Model $item, array $data): bool
    {
        if (is_int($item)) {
            $item = self::getById($item);
        }

        throw_if(!$item, ModelNotFoundException::class);

        if ($data['address_type_id'] == 1) {
            $addressable = $item->addressable;
            $countMainAddresses = $addressable->addresses()
                ->where('id', "!=", $item->id)
                ->mainAddress()
                ->count();

            throw_if($countMainAddresses, new \Exception(
                'Apenas 1 endereço pode ser definido como principal',
                400
            ));
        }

        return $item->update($data);
    }
}
