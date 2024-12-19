<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\Buyer\AuthController;

Route::get('login', [AuthController::class, 'showLoginForm'])->name('showLoginForm');
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('registrar', [AuthController::class, 'register'])->name('register');
Route::get('vendedor/login', [AuthController::class, 'showSellerLoginForm'])->name('showSellerLoginForm');
