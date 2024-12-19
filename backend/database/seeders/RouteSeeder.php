<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Route;
use App\Services\RouteService;
use Exception;
use Illuminate\Database\Seeder;

class RouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws Exception
     */
    public function run()
    {
        $data = [
            ['url' => ''],
            ['url' => 'login'],
            ['url' => 'recuperar-senha'],
            ['url' => 'redefinir-senha'],

            ['url' => 'industria'],

            ['url' => 'minha-conta/logout'],
            ['url' => 'minha-conta/pedidos'],
            ['url' => 'minha-conta/pedidos-cancelados'],
            ['url' => 'minha-conta/pedidos-finalizados'],
            ['url' => 'minha-conta/favoritos'],
            ['url' => 'minha-conta/suporte'],
            ['url' => 'minha-conta/empresa'],
            ['url' => 'minha-conta/enderecos'],
            ['url' => 'minha-conta/contatos'],
            ['url' => 'minha-conta/contas-bancarias'],
            ['url' => 'minha-conta/redes-sociais'],
            ['url' => 'minha-conta/verificar'],
            ['url' => 'minha-conta/verificar/enviar-notificacao'],
        ];

        foreach ($data as $item) {
            Route::firstOrCreate($item);
        }

        $this->redefineProductRoutes();
    }

    /**
     * @throws Exception
     */
    protected function redefineProductRoutes()
    {
        $products = Product::whereDoesntHave('route')->get();

        foreach ($products as $product) {
            $generatedUrl = $product->generateUrl();

            $routeService = new RouteService(new Route());

            $routeService->store(
                $product,
                $routeService->generateUniqueUrlByString($product, $generatedUrl)
            );
        }
    }
}
