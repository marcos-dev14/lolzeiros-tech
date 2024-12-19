<?php

namespace App\Providers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Buyer;
use App\Models\CartInstance;
use App\Models\CartInstanceProduct;
use App\Models\Client;
use App\Models\Attribute;
use App\Models\Invoice;
use App\Models\Navigation;
use App\Models\NavigationLink;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\Supplier;
use App\Models\User;
use App\Observers\BlogCategoryObserver;
use App\Observers\BlogPostObserver;
use App\Observers\BuyerObserver;
use App\Observers\CartInstanceObserver;
use App\Observers\CartInstanceProductObserver;
use App\Observers\ClientObserver;
use App\Observers\InvoiceObserver;
use App\Observers\NavigationLinkObserver;
use App\Observers\NavigationObserver;
use App\Observers\OrderObserver;
use App\Observers\OrderStatusObserver;
use App\Observers\Product\AttributeObserver;
use App\Observers\Product\ProductObserver;
use App\Observers\SupplierObserver;
use App\Observers\UserObserver;
use App\Observers\Product\ProductAttributeObserver;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Carbon\Carbon;
use DB;
use Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use ProtoneMedia\LaravelEloquentWhereNot\WhereNot;
use Staudenmeir\LaravelAdjacencyList\Eloquent\Collection;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        if (!$this->app->environment('production')) {
            $this->app->register('App\Providers\FakerServiceProvider');
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        date_default_timezone_set('America/Sao_Paulo');
        setlocale(LC_ALL, 'pt_BR.utf-8', 'ptb', 'pt_BR', 'portuguese-brazil', 'portuguese-brazilian', 'bra', 'brazil', 'br');

        Carbon::setLocale(config('app.localeCarbon'));

        Schema::defaultStringLength(191);

        Paginator::useBootstrapThree();

        //------------------------------------------------------------------
        // Macros
        //------------------------------------------------------------------
        WhereNot::addMacro();

        Collection::macro('paginate', function ($perPage = 15, $total = null, $page = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);

            return new LengthAwarePaginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName
                ]
            );
        });

        //------------------------------------------------------------------
        // Observers
        //------------------------------------------------------------------
        User::observe(UserObserver::class);
        Attribute::observe(AttributeObserver::class);
        Product::observe(ProductObserver::class);
        ProductAttribute::observe(ProductAttributeObserver::class);
        Client::observe(ClientObserver::class);
        BlogCategory::observe(BlogCategoryObserver::class);
        BlogPost::observe(BlogPostObserver::class);
        CartInstance::observe(CartInstanceObserver::class);
        Order::observe(OrderObserver::class);
        OrderStatus::observe(OrderStatusObserver::class);
        Supplier::observe(SupplierObserver::class);
        Buyer::observe(BuyerObserver::class);
        CartInstanceProduct::observe(CartInstanceProductObserver::class);
        Navigation::observe(NavigationObserver::class);
        NavigationLink::observe(NavigationLinkObserver::class);
        Invoice::observe(InvoiceObserver::class);
    }
}
