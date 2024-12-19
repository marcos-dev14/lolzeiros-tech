<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\View\View;

class IndexController extends Controller
{
    public function index(): View
    {
        return view('frontend.index');
    }

    public function login(Request $request): RedirectResponse
    {
        if (!$request->email) {
            return redirect()->route('frontend.index');
        }

        $client = Client::where('corporate_email', $request->email)->first();

        if (!$client) {
            return redirect()->route('frontend.index');
        }

        return redirect()->route('frontend.suppliers', $client);
    }

    public function products(Client $client, Supplier $supplier): View
    {
        $client->load('profile');
        $categories = $this->getCategories($supplier);

        $products = Product::with('images')
            ->select('id', 'title', 'supplier_id', 'unit_price', 'unit_price_promotional')
            ->where('supplier_id', $supplier->id)
            ->take(42)->get();

        $clientProfile = $client->profile;
        $supplierProfileDiscounts = $supplier->profileDiscounts()
            ->where('client_profile_id', $clientProfile->id)
            ->select('id', 'type', 'discount_value', 'client_profile_id')
            ->doesntHave('categories')//->get()
        ;

        $supplierProfileDiscountsThatHasCategories = $supplier->profileDiscounts()
            ->where('client_profile_id', $clientProfile->id)
            ->select('id', 'type', 'discount_value', 'client_profile_id')
            ->has('categories')
//            ->with('categories', function ($query) {
//                return $query->select('id');
//            })
            //->get()
        ;

        $products = $products->map(function ($product) use ($supplierProfileDiscounts, $supplierProfileDiscountsThatHasCategories) {
            $profileDiscounts = (double)$supplierProfileDiscounts->sum('discount_value');

//            $profileCategoryDiscounts = (double) $supplierProfileDiscountsThatHasCategories->sum('discount_value');
//            if ($profileCategoryDiscounts > 0.0) {
//                $supplierProfileDiscountCategories = $supplierProfileDiscountsThatHasCategories
//                    ->with('categories', function ($query) {
//                        return $query->select('id');
//                })->get();
//
//                dd($supplierProfileDiscountCategories);
//
//                $profileDiscountCategories = Category::select('id')
//                    ->whereIn($supplierProfileWithCategoriesDiscounts->categories->pluck('id'))
//                    ->get();
//
//                dd($profileDiscountCategories);
//            }
//            dd($profileDiscounts, $categoryDiscounts);

            $product->unit_price = $product->unit_price - ($product->unit_price * ($profileDiscounts / 100));
            $product->unit_price_promotional = $product->unit_price_promotional - ($product->unit_price_promotional * ($profileDiscounts / 100));

            return $product;
        });

        //dd($supplierProfileDiscounts, $supplierProfileWithCategoriesDiscounts);

        return view('frontend.products', compact('products', 'client', 'categories', 'supplier'));
    }

    protected function getCategories(Supplier $supplier): Collection
    {
        $categories = Category::select('id', 'name', 'slug', 'order', 'supplier_id')
            ->withCount('products')
            ->where('supplier_id', $supplier->id)
            ->get();

        return $categories->where('products_count', '>', 0)->sortBy('order') ?? collect([]);
    }

    public function productsByCategory(Client $client, Supplier $supplier, Category $category): View
    {
        $categories = $this->getCategories($supplier);

        $products = Product::where('supplier_id', $supplier->id)
            ->where('category_id', $category->id)
            ->take(42)->get();

        $currentlyCategory = $category;

        return view('frontend.products', compact('products', 'client', 'categories', 'supplier', 'currentlyCategory'));
    }

    public function suppliers(Client $client): View
    {
        $clientBlockedSuppliers = $client->blockedSuppliers->pluck('id');
        $clientRegions = $client->regions->pluck('id');

        $suppliers = Supplier::selling();
//        $allSuppliers = $suppliers->get();

        // Representadas bloqueadas pelo cliente
        if (count($clientBlockedSuppliers)) {
            $suppliers->whereNotIn('id', $clientBlockedSuppliers);
        }

        // Regiões que não são permitida venda
        $suppliers->where(function ($query) use ($clientRegions) {
            $query->doesnthave('blockedRegions', 'or', function ($query) use ($clientRegions) {
                $query->whereIn('client_region_id', $clientRegions);
            });
        });

        $suppliers = $suppliers->where('is_available', 1)->get();

//        $availableSuppliers = $suppliers->pluck('id');
//        $suppliers = $allSuppliers->map(function ($supplier) use ($availableSuppliers) {
//            $supplier->blocked = !$availableSuppliers->has('id', $supplier->id);
//            return $supplier;
//        });

        return view('frontend.suppliers', compact('suppliers', 'client'));
    }
}
