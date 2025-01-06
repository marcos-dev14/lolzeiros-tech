<?php

use App\Http\Controllers\Frontend\OpportunityController;
use App\Http\Controllers\Frontend\Seller\SellerController;
use Illuminate\Support\Facades\Route;

//require 'AuthSeller/recovery.php';

// Route::middleware('auth:seller')->group(function () {
//     Route::prefix('vendedor')->group(function () {
//         Route::get('/dashboard', [SellerController::class, 'dashboard'])->name('dashboard');
//         Route::get('/clientes-disponivel', [OpportunityController::class, 'index'])->name('opportunities.index');
//         Route::get('/clientes', [SellerController::class, 'clients'])->name('clients');
//         Route::get('/perfil', [SellerController::class, 'profile'])->name('profile');
//     });
// });

Route::prefix('vendedor')->group(function () {
    Route::get('/dashboard', [SellerController::class, 'dashboard'])->name('dashboard');
    Route::get('/clientes-disponivel', [OpportunityController::class, 'index'])->name('opportunities.index');
    Route::get('/clientes', [SellerController::class, 'clients'])->name('clients');
    Route::get('/perfil', [SellerController::class, 'profile'])->name('profile');
});

/* Route::group(['prefix' => 'minha-conta', 'middleware' => 'auth:buyer'], function () {
    require 'Auth/verify.php';
}); */
