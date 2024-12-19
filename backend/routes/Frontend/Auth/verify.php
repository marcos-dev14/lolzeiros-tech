<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\Buyer\VerifyController;

Route::group(['prefix' => 'email', 'as' => 'verification.'], function () {
    Route::get('verificar', [VerifyController::class, 'showVerificationForm'])->name('notice');

    Route::post('verificar/enviar-notificacao', [VerifyController::class, 'sendEmailVerification'])
        ->middleware(['throttle:6,1'])
        ->name('send');

    Route::get('verificar/{id}/{hash}', [VerifyController::class, 'verify'])
        ->middleware('signed')
        ->name('verify');
});
