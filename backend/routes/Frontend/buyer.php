<?php

use App\Http\Controllers\Frontend\Buyer\AuthController;
use App\Http\Controllers\Frontend\Buyer\BuyerController;
use App\Http\Controllers\Frontend\Buyer\ClientAddressController;
use App\Http\Controllers\Frontend\Buyer\ClientBankAccountController;
use App\Http\Controllers\Frontend\Buyer\ClientContactController;
use App\Http\Controllers\Frontend\Buyer\ClientController;
use App\Http\Controllers\Frontend\Buyer\ClientWishlistController;
use App\Http\Controllers\Frontend\OrderController;
use Illuminate\Support\Facades\Route;

require 'Auth/recovery.php';

Route::group(['as' => 'buyer.'], function () {
    require 'Auth/auth.php';

    Route::get('pedidos/download/{orderCode}', [ClientController::class, 'downloadPDF'])->name('downloadPDF');

    Route::group(['prefix' => 'minha-conta', 'middleware' => 'auth:buyer'], function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

//        Route::group(['middleware' => 'verified'], function () {
        Route::get('lojas', [BuyerController::class, 'clients'])->name('clients');
        Route::get('nova-loja', [BuyerController::class, 'showNewClientForm'])->name('clients.new');
        Route::post('nova-loja', [BuyerController::class, 'storeClient'])->name('clients.store');

        Route::get('pedidos', [ClientController::class, 'orders'])->name('orders');
        Route::get('pedidos-cancelados', [ClientController::class, 'canceledOrders'])->name('canceledOrders');
        Route::get('pedidos-finalizados', [ClientController::class, 'closedOrders'])->name('closedOrders');
        Route::get('pedidos/importar', [ClientController::class, 'ordersImport'])->name('ordersImport');
        Route::get('exportar/{code}', [OrderController::class, 'orderExport'])->name('exportar_order');


        Route::get('cupons', [ClientController::class, 'cupons'])->name('cupons');

        Route::get('parabens', [OrderController::class, 'congratulations'])->name('congratulations');


        Route::get('favoritos', [ClientWishlistController::class, 'wishlist'])->name('wishlist');
        Route::get('suporte', [ClientController::class, 'support'])->name('support');
        Route::get('empresa', [ClientController::class, 'company'])->name('company');

        Route::group(['prefix' => 'enderecos', 'as' => 'address.'], function () {
            Route::get('', [ClientAddressController::class, 'index'])->name('list');
            Route::get('novo', [ClientAddressController::class, 'create'])->name('create');
            Route::post('adicionar', [ClientAddressController::class, 'store'])->name('store');
            Route::get('{address}/editar', [ClientAddressController::class, 'edit'])->name('edit');
            Route::put('{address}/atualizar', [ClientAddressController::class, 'update'])->name('update');
            Route::delete('{address}/remover', [ClientAddressController::class, 'destroy'])->name('destroy');
        });

        Route::group(['prefix' => 'equipe', 'as' => 'contact.'], function () {
            Route::get('', [ClientContactController::class, 'index'])->name('list');
            Route::get('novo', [ClientContactController::class, 'create'])->name('create');
            Route::post('adicionar', [ClientContactController::class, 'store'])->name('store');
            Route::get('{contact}/editar', [ClientContactController::class, 'edit'])->name('edit');
            Route::put('{contact}/atualizar', [ClientContactController::class, 'update'])->name('update');
            Route::delete('{contact}/remover', [ClientContactController::class, 'destroy'])->name('destroy');
        });

        Route::group(['prefix' => 'bancos', 'as' => 'bank_account.'], function () {
            Route::get('', [ClientBankAccountController::class, 'index'])->name('list');
            Route::get('novo', [ClientBankAccountController::class, 'create'])->name('create');
            Route::post('adicionar', [ClientBankAccountController::class, 'store'])->name('store');
            Route::get('{bankAccount}/editar', [ClientBankAccountController::class, 'edit'])->name('edit');
            Route::put('{bankAccount}/atualizar', [ClientBankAccountController::class, 'update'])->name('update');
            Route::delete('{bankAccount}/remover', [ClientBankAccountController::class, 'destroy'])->name('destroy');
        });

        Route::get('dados-acesso', [ClientController::class, 'password'])->name('password');
        Route::put('dados-acesso', [ClientController::class, 'updatePassword'])->name('password.update');

        Route::get('comercial', [ClientController::class, 'commercial'])->name('commercial');

        Route::get('redes-sociais', [ClientController::class, 'social'])->name('social');

        Route::post('selecionar-loja', [ClientController::class, 'changeSelectedClient'])->name('changeSelectedClient');
        Route::put('cliente/{client}', [ClientController::class, 'update'])->name('client.update');

        Route::group(['prefix' => 'favoritos'], function () {
            Route::post('{product}', [ClientWishlistController::class, 'wishlistAdd'])->name('wishlistAdd');
            Route::delete('{product}', [ClientWishlistController::class, 'wishlistRemove'])->name('wishlistRemove');
        });
//        });
    });
});

Route::group(['prefix' => 'minha-conta', 'middleware' => 'auth:buyer'], function () {
    require 'Auth/verify.php';
});
