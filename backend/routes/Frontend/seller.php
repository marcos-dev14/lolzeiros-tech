<?php


use Illuminate\Support\Facades\Route;

//require 'AuthSeller/recovery.php';

Route::group(['as' => 'seller.'], function () {
    require 'AuthSeller/auth.php';

});

/* Route::group(['prefix' => 'minha-conta', 'middleware' => 'auth:buyer'], function () {
    require 'Auth/verify.php';
}); */
