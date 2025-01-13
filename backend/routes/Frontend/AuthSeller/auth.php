<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\Seller\SellerAuthController;

Route::get('vendedor/entrar', [SellerAuthController::class, 'showLoginForm'])->name('showLoginForm');
Route::post('vendedor/entrar', [SellerAuthController::class, 'login'])->name('login');
Route::post('vendedor/logout', [SellerAuthController::class, 'logout'])->name('logout');
Route::get('vendedor/login/cliente', [SellerAuthController::class, 'showSellerLoginForm'])->name('showSellerLoginForm');