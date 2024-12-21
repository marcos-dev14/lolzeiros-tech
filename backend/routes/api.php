<?php

use App\Http\Controllers\Api\AddressTypeController;
use App\Http\Controllers\Api\AttributeCategoryController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\BlockingRuleController;
use App\Http\Controllers\Api\BlogAuthorController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\BlogPostFileController;
use App\Http\Controllers\Api\BlogPostImageController;
use App\Http\Controllers\Api\BlogPostRouteController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClientAddressController;
use App\Http\Controllers\Api\ClientBankAccountController;
use App\Http\Controllers\Api\ClientBlockedSupplierController;
use App\Http\Controllers\Api\ClientContactController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ClientGroupController;
use App\Http\Controllers\Api\ClientOriginController;
use App\Http\Controllers\Api\ClientPdvController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\CommissionRuleController;
use App\Http\Controllers\Api\ConfigurationsController;
use App\Http\Controllers\Api\CountryStateController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ImportColumnController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\InvoiceBilletsController;
use App\Http\Controllers\Api\InvoiceBilletsImportMassController;
use App\Http\Controllers\Api\InvoiceBilletStatusesController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\InvoiceImportController;
use App\Http\Controllers\Api\InvoiceImportMassController;
use App\Http\Controllers\Api\LeadTimeController;
use App\Http\Controllers\Api\NavigationController;
use App\Http\Controllers\Api\NavigationLinkController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderSolutionController;
use App\Http\Controllers\Api\ProductAttributeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductFileController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ProductRelatedController;
use App\Http\Controllers\Api\ProductRouteController;
use App\Http\Controllers\Api\ProductVariationController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SaleChannelController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\SeoConfigurationController;
use App\Http\Controllers\Api\ShippingCompanyController;
use App\Http\Controllers\Api\ShippingTypeController;
use App\Http\Controllers\Api\SupplierAddressController;
use App\Http\Controllers\Api\SupplierBankAccountController;
use App\Http\Controllers\Api\SupplierBlockedRegionController;
use App\Http\Controllers\Api\SupplierBlockedStateController;
use App\Http\Controllers\Api\SupplierBlockingRuleController;
use App\Http\Controllers\Api\SupplierCommissionRuleController;
use App\Http\Controllers\Api\SupplierContactController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\SupplierInstallmentRuleController;
use App\Http\Controllers\Api\SupplierPaymentPromotionController;
use App\Http\Controllers\Api\SupplierPhoneController;
use App\Http\Controllers\Api\SupplierProfileDiscountController;
use App\Http\Controllers\Api\SupplierProfileFractionationController;
use App\Http\Controllers\Api\SupplierPromotionController;
use App\Http\Controllers\Api\SupplierStateDiscountController;
use App\Http\Controllers\Api\TaxRegimeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VCardController;
use Illuminate\Support\Facades\Route;

Route::get('vcard/{name}', [VCardController::class, 'index'])->name('vcard');

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::get('country_states', [CountryStateController::class, 'index'])->name('country_states');
Route::get('country_cities/{countryState}', [CountryStateController::class, 'cities'])->name('country_cities');

Route::group(['middleware' => ['auth:sanctum', 'api.auth']], function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('seo_configurations', [SeoConfigurationController::class, 'show'])->name('seo_configurations.show');
    Route::put('seo_configurations', [SeoConfigurationController::class, 'update'])->name('seo_configurations.update');

    Route::group(['prefix' => 'seo_configurations'], function () {
        Route::post('images/{imageName}', [SeoConfigurationController::class, 'storeImage']);
        Route::delete('images/{imageName}', [SeoConfigurationController::class, 'destroyImage']);
    });

    Route::apiResource('users', UserController::class);
    Route::get('configurations', ConfigurationsController::class)->name('configurations');
    Route::apiResource('sellers', SellerController::class, []);
    Route::apiResource('tax_regimes', TaxRegimeController::class, ['except' => ['show']]);
    Route::apiResource('roles', RoleController::class, ['except' => ['show']]);
    Route::apiResource('address_types', AddressTypeController::class, ['except' => ['show']]);
    Route::apiResource('banks', BankController::class, ['except' => ['show']]);

    Route::apiResource('shipping_companies', ShippingCompanyController::class, ['except' => ['show']]);

    Route::group(['prefix' => 'suppliers'], function () {
        Route::apiResource('lead_times', LeadTimeController::class, ['except' => ['show']]);
        Route::apiResource('commission_rules', CommissionRuleController::class, ['except' => ['show']]);
        Route::apiResource('shipping_types', ShippingTypeController::class, ['except' => ['show']]);
    });

    Route::group(['prefix' => 'products'], function () {
        Route::apiResource('brands', BrandController::class);
        Route::apiResource('badges', BadgeController::class);

        Route::apiResource('attribute-categories', AttributeCategoryController::class);
        Route::put('attribute-categories/{attribute_category}/attributes/sort', [AttributeController::class, 'sort'])
            ->name('attribute-categories.attributes.update_order');
        Route::apiResource('attribute-categories.attributes', AttributeController::class);

        Route::apiResource('suppliers', SupplierController::class);
        Route::group(['prefix' => 'suppliers/{supplier}', 'as' => 'suppliers.'], function () {
            Route::put('categories/sort', [CategoryController::class, 'updateOrder'])->name('update_order');
            Route::apiResource('blocked_states', SupplierBlockedStateController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('blocked_regions', SupplierBlockedRegionController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('blocking_rules', SupplierBlockingRuleController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('commission_rules', SupplierCommissionRuleController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('phones', SupplierPhoneController::class, ['except' => ['show']]);
            Route::apiResource('payment_promotions', SupplierPaymentPromotionController::class, ['except' => ['index', 'show']]);
            Route::apiResource('installment_rules', SupplierInstallmentRuleController::class, ['except' => ['index', 'show']]);

            Route::apiResource('state_discounts', SupplierStateDiscountController::class, ['except' => ['index', 'show']]);
            Route::apiResource('profile_discounts', SupplierProfileDiscountController::class, ['except' => ['index', 'show']]);
            Route::apiResource('promotions', SupplierPromotionController::class, ['except' => ['index', 'show']]);
            Route::apiResource('contacts', SupplierContactController::class, ['except' => ['index', 'show']]);
            Route::apiResource('addresses', SupplierAddressController::class, ['except' => ['index', 'show']]);
            Route::apiResource('bank_accounts', SupplierBankAccountController::class, ['except' => ['index', 'show']]);
            Route::apiResource('profile_fractionations', SupplierProfileFractionationController::class, ['except' => ['index', 'show']]);
        });

        Route::apiResource('imports', ImportController::class);
        Route::group(['prefix' => 'imports', 'as' => 'imports.'], function () {
            Route::post('{import}/upload', [ImportController::class, 'upload'])->name('upload');
            Route::post('{import}/copy', [ImportController::class, 'copy'])->name('copy');
            Route::delete('{import}/rollback', [ImportController::class, 'rollback'])->name('rollback');
            Route::get('columns/configurations', [ImportColumnController::class, 'getAvailableFields'])->name('columns.configurations');
        });
        Route::apiResource('imports.columns', ImportColumnController::class, ['only' => ['store', 'destroy']]);
    });

    Route::apiResource('products', ProductController::class);

    Route::group(['prefix' => 'products/{product}', 'as' => 'product.'], function () {
        Route::apiResource('variations', ProductVariationController::class, ['only' => ['store', 'destroy']]);
        Route::apiResource('related', ProductRelatedController::class, ['only' => ['store', 'destroy']]);
        Route::apiResource('files', ProductFileController::class, ['only' => ['store', 'destroy']]);
        Route::apiResource('main-images', ProductImageController::class, ['only' => ['store', 'destroy']]);
        Route::apiResource('images', ProductImageController::class, ['only' => ['store', 'destroy']]);

        Route::put('attributes/{attribute}', [ProductAttributeController::class, 'update'])->name('update');
        Route::delete('attributes/{attribute}', [ProductAttributeController::class, 'detach'])->name('detach');

        Route::post('routes/checks', [ProductRouteController::class, 'isAvailable'])->name('route');
        Route::put('routes', [ProductRouteController::class, 'update'])->name('route.check');

        Route::put('images/sort', [ProductImageController::class, 'sort'])->name('images.update_order');
    });

    Route::get('regions', fn() => collect([]));
    Route::apiResource('blocking_rules', BlockingRuleController::class, ['except' => ['show']]);
    Route::apiResource('buyers', BuyerController::class);
    Route::group(['prefix' => 'clients'], function () {
        Route::apiResource('groups', ClientGroupController::class);
        Route::apiResource('profiles', ClientProfileController::class, ['except' => ['show']]);
        Route::apiResource('pdvs', ClientPdvController::class, ['except' => ['show']]);
        Route::apiResource('origins', ClientOriginController::class, ['except' => ['show']]);
    });

    Route::apiResource('clients', ClientController::class);
    Route::group(['prefix' => 'clients/{client}', 'as' => 'clients.'], function () {
        Route::post('revalidates', [ClientController::class, 'updateFromExternalApi']);
        Route::apiResource('blocked_suppliers', ClientBlockedSupplierController::class, ['only' => ['store', 'destroy']]);
        Route::apiResource('contacts', ClientContactController::class, ['except' => ['index', 'show']]);
        Route::apiResource('addresses', ClientAddressController::class, ['except' => ['index', 'show']]);
        Route::apiResource('bank_accounts', ClientBankAccountController::class, ['except' => ['index', 'show']]);

        Route::get('suppliers', [SupplierController::class, 'getByClient'])->name('suppliers');
    });

    Route::get('navigations/locations', [NavigationController::class, 'getLocations'])->name('navigations.locations');
    Route::apiResource('navigations', NavigationController::class);
    Route::put('navigations/{navigation}/links/sort', [NavigationLinkController::class, 'updateOrder'])->name('update_order');
    Route::apiResource('navigations.links', NavigationLinkController::class, ['except' => ['show']]);
    Route::get('navigations/links/types', [NavigationLinkController::class, 'types']);

    Route::group(['prefix' => 'blogs', 'as' => 'blog.'], function () {
        Route::apiResource('authors', BlogAuthorController::class);
        Route::apiResource('categories', BlogCategoryController::class, ['except' => ['show']]);
        Route::apiResource('posts', BlogPostController::class);

        Route::group(['prefix' => 'posts/{post}', 'as' => 'post.'], function () {
            Route::apiResource('files', BlogPostFileController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('main-images', BlogPostImageController::class, ['only' => ['store', 'destroy']]);
            Route::apiResource('images', BlogPostImageController::class, ['only' => ['store', 'destroy']]);

            Route::post('routes/checks', [BlogPostRouteController::class, 'isAvailable'])->name('route');
            Route::put('routes', [BlogPostRouteController::class, 'update'])->name('route.check');

            Route::put('images/sort', [BlogPostImageController::class, 'sort'])->name('images.update_order');
        });
    });

    Route::apiResource('sale_channels', SaleChannelController::class, ['except' => ['show']]);

    Route::group(['prefix' => 'orders', 'as' => 'orders.'], function () {
        Route::get('', [OrderController::class, 'index'])->name('index');
        Route::get('{orderCode}', [OrderController::class, 'show'])->name('show');
        Route::put('{orderCode}', [OrderController::class, 'update'])->name('update');
        Route::get('exportar/{code}', [OrderController::class, 'orderExport'])->name('export');
    });

    Route::group(['prefix' => 'banners'], function () {
        Route::get('', [BannerController::class, 'index']);

        Route::group(['prefix' => '{block}/images'], function () {
            Route::get('', [BannerController::class, 'images']);
            Route::post('', [BannerController::class, 'storeImages']);
            Route::put('sort', [BannerController::class, 'updateOrder']);
            Route::put('{image}', [BannerController::class, 'update']);
            Route::delete('{image}', [BannerController::class, 'destroy']);
        });
    });

    Route::group(['prefix' => 'invoices'], function () {
        Route::get('', [InvoiceController::class, 'all']);
        Route::get('orders', [InvoiceController::class, 'orderslist']);
        Route::get('order/{order}', [InvoiceController::class, 'ordersShow']);
        Route::get('{invoice}', [InvoiceController::class, 'index']);
        Route::post('create/{order}', [InvoiceController::class, 'create']);
        Route::post('create/free/{order}', [InvoiceController::class, 'free']);
        Route::put('{invoice}', [InvoiceController::class, 'update']);
        Route::delete('{invoice}', [InvoiceController::class, 'delete']);
        Route::post('updatebillets/{invoice}', [InvoiceController::class, 'updateBillets']);

        Route::group(['prefix' => 'pdf'], function () {
            Route::get('export/{order}', [InvoiceController::class, 'export']);
            Route::get('export/invoice/{invoice}', [InvoiceController::class, 'exportInvoice']);
            Route::post('import/{invoice}', [InvoiceController::class, 'import']);
            Route::get('download/{PdfImports}', [InvoiceController::class, 'downloadPdf']);
            Route::delete('delete/{PdfImports}', [InvoiceController::class, 'deletePdf']);
        });
    });

    Route::post('invoicing/import-xml/{id}', [InvoiceImportController::class, 'byXml']);
    Route::post('invoicing/import-excel/{id}', [InvoiceImportMassController::class, 'byExcel']);
    Route::post('invoicingBillets/import-excel/{id}', [InvoiceBilletsImportMassController::class, 'byExcel']);
    Route::post('orderSolutions/import-excel', [OrderSolutionController::class, 'byExcel']);
    Route::get('invoicing/download-excel', [InvoiceImportMassController::class, 'invoiceDownload']);
    Route::get('invoicingBillets/download-excel', [InvoiceBilletsImportMassController::class, 'invoiceBilletsDownload']);


    Route::group(['prefix' => 'coupons'], function () {
        Route::get('', [CouponController::class, 'index']);
        Route::post('novocupon', [CouponController::class, 'create']);
        Route::get('novocupon', [CouponController::class, 'search']);
        Route::get('{coupon}', [CouponController::class, 'show']);
        Route::post('{coupon}', [CouponController::class, 'update']);
        Route::delete('{coupon}', [CouponController::class, 'delete']);
    });

    Route::group(['prefix' => 'billets'], function () {
        Route::get('', [InvoiceBilletsController::class, 'all']);
        Route::get('paids', [InvoiceBilletsController::class, 'paidat']);
        Route::get('{invoiceBillet}', [InvoiceBilletsController::class, 'index']);
        Route::post('paid/{invoiceBillet}', [InvoiceBilletsController::class, 'paid']);
        Route::post('unpaid/{invoiceBillet}', [InvoiceBilletsController::class, 'unpaid']);
        Route::post('{invoiceBillet}', [InvoiceBilletsController::class, 'update']);
    });

    Route::group(['prefix' => 'status'], function () {
        Route::get('', [InvoiceBilletStatusesController::class, 'index']);
        Route::post('', [InvoiceBilletStatusesController::class, 'store']);
        Route::get('{invoiceBilletStatus}', [InvoiceBilletStatusesController::class, 'show']);
        Route::post('{invoiceBilletStatus}', [InvoiceBilletStatusesController::class, 'update']);
        Route::delete('{invoiceBilletStatus}', [InvoiceBilletStatusesController::class, 'destroy']);
    });


});

