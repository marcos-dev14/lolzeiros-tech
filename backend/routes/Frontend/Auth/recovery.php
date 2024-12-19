<?php

use App\Http\Controllers\Frontend\Buyer\PasswordController;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'password.', 'middleware' => 'guest'], function () {
    Route::get('recuperar-senha', [PasswordController::class, 'showRecoveryForm'])->name('request');
    Route::post('recuperar-senha', [PasswordController::class, 'sendEmailRecovery'])->name('email');

    Route::get('redefinir-senha/{token}', [PasswordController::class, 'showRedefinitionForm'])->name('reset');
    Route::post('redefinir-senha', [PasswordController::class, 'resetPassword'])->name('update');
});
