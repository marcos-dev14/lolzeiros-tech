<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\SitemapController;
use App\Http\Controllers\Frontend\ProductController;
use App\Http\Controllers\Frontend\RouteController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\CouponController;
use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\OrderController;

// TODO Joseph crie um controller para o script abaixo - sugiro InsomniaDocumentationController
Route::get('doc/{partner}', function (string $partner) {
    $token = "{$partner}_api";
    $partnerHash = str_replace('Bearer ', '', config("api.hashAccess.$partner.hash"));

    abort_if(!password_verify($token, $partnerHash), 403);

    return view('api.doc.index', compact('partner'));
});


Route::get('sitemap.xml', SitemapController::class);

Route::get('', [HomeController::class, 'index'])->name('index');
Route::get('industrias', [PageController::class, 'industry'])->name('page.industry');
Route::get('marcas', [PageController::class, 'brands'])->name('page.brands');


Route::post('carrinho/adicionar', [CartController::class, 'add'])->name('cart.add');
Route::post('carrinho/upload', [CartController::class, 'upload'])->name('cart.upload');

Route::get('cart/progress', [CartController::class, 'progress'])->name('cart.progress');

Route::get('cart/logs', [CartController::class, 'logs'])->name('cart.logs');

Route::group(['prefix' => 'carrinho', 'as' => 'cart.'], function () {
    Route::get('obter-html', [CartController::class, 'getUpdatedCartBoxHtml'])->name('html');
});

Route::group(['middleware' => 'auth:buyer'], function () {
    Route::group(['prefix' => 'carrinho', 'as' => 'cart.'], function () {
        Route::get('', [CartController::class, 'showCart'])->name('index');
        Route::put('atualizar', [CartController::class, 'update'])->name('update');
        Route::get('revalidar', [CartController::class, 'refreshCartProducts'])->name('revalidate');
        Route::put('atualizar-informacoes/{instance}', [CartController::class, 'updateData'])->name('update_data');
        Route::delete('remover/{instance}/{product}', [CartController::class, 'remove'])->name('remove');
        Route::get('remover/{instance}', [CartController::class, 'removeAll'])->name('remove.all');
        Route::get('finalizar/{instance}', [CartController::class, 'showPreOrder'])->name('show_order');

        Route::post('finalizar', [OrderController::class, 'store'])->name('store_order');
        Route::get('cancelar/{instance}', [OrderController::class, 'cancel'])->name('cancel_order');
        Route::get('download/{instance}', [OrderController::class, 'downloadPDf'])->name('download_pdf');
        Route::post('copiar/{id}', [CartController::class, 'reOrder'])->name('cart.readd');
    });
});

require 'Frontend/buyer.php';

Route::get('produtos', [ProductController::class, 'index'])->name('products');
Route::get('products/suggestions', [ProductController::class, 'suggestions'])->name('products.suggestions');
Route::post('products/save-search-term', [ProductController::class, 'saveSearchTerm'])->name('products.save-search-term');
Route::get('produtos/precos/{productId}/{qty?}', [ProductController::class, 'getPriceWithPromotionDiscounts'])->name('products.prices');
Route::get('produtos/cupon/{coupon}', [CouponController::class, 'getProducts'])->name('getProductsWithCoupon');
Route::get('{path}', [RouteController::class, 'handle'])->where('path', '.+')->name('route');
Route::post('cupon', [CouponController::class, 'index'])->name('coupon');


