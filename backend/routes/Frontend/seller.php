<?php

use App\Http\Controllers\Frontend\OpportunityController;
use App\Http\Controllers\Frontend\Seller\SellerController;
use Illuminate\Support\Facades\Route;

//require 'AuthSeller/recovery.php';

Route::group(['as' => 'seller.'],function () {
    require 'AuthSeller/auth.php';

    Route::prefix('vendedor')->group(function () {
        Route::get('/dashboard', [SellerController::class, 'clients'])->name('dashboard');
        Route::get('/carrinhos-abandonados', [SellerController::class, 'abandonedCarts'])->name('abandonedCarts');
        Route::get('/pedidos', [SellerController::class, 'orders'])->name('orders');
        Route::get('/pedido/{orderCode}', [SellerController::class, 'order'])->name('order');
        Route::get('/clientes-d', [OpportunityController::class, 'index'])->name('opportunities.index');
        Route::get('/clientes-disponiveis/{supplierSlug}', [OpportunityController::class, 'opportunitiesFromSupplier'])->name('opportunitiesFromSupplier');
        Route::get('/clientes', [SellerController::class, 'clients'])->name('clients');
        Route::get('/clientes-disponiveis', [SellerController::class, 'availableClients'])->name('availableClients');
        Route::get('/perfil', [SellerController::class, 'profile'])->name('profile');

        Route::post('/add-favorito', [SellerController::class, 'addFavoritable'])->name('addfavoritable');
        Route::post('/rem-favorito', [SellerController::class, 'removeFavoritable'])->name('removefavoritable');
    });
});

/* Route::group(['prefix' => 'minha-conta', 'middleware' => 'auth:buyer'], function () {
    require 'Auth/verify.php';
}); */
