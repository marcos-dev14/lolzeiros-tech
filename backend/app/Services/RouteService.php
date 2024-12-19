<?php

namespace App\Services;

use App\Models\Route;
use Exception;
use Illuminate\Database\Eloquent\Model;
use JetBrains\PhpStorm\NoReturn;

class RouteService
{
    #[NoReturn]
    public function __construct(private Route $_model) {}

    public function generateUniqueUrlByString(Model $routableInstance, string $string): string
    {
        if ($this->_model->isAvailable($routableInstance, $string)) {
            return $string;
        }

        $i = 1;
        $baseString = $string;
        while (!$this->_model->isAvailable($routableInstance, $string)) {
            $string = "$baseString-$i";
            $i++;
        }

        return $string;
    }

    /**
     * @throws Exception
     */
    public function store(Model $routableInstance, string $url)
    {
        try {
            $this->_model->firstOrCreate([
                'routable_type' => $routableInstance::class,
                'routable_id' => $routableInstance->id
            ], [
                'url' => $url
            ]);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
