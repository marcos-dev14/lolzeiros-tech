<?php

namespace App\Http\Controllers\Api;

use App\Models\Brand;
use App\Models\Buyer;
use App\Models\Category;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\Product;
use App\Models\Seller;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Lang;

class CouponController extends BaseController
{
    public function index()
    {
        $coupons = Coupon::paginate(15); // Adjust the number 10 to the number of items per page you want
        return response()->json($coupons);
    }
    public function search(Request $request)
    {
        $data = [];

        if ($request->has('buyer')) {
            $clients = Client::query();
            $buyer = $request->buyer;
            $clients->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($buyer) . "%"]);
            $clients = $clients->get();
            $data = $clients;
        }

        if ($request->has('seller')) {
            $sellers = Seller::query();
            $seller = $request->seller;
            $sellers->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($seller) . "%"]);
            $sellers = $sellers->get();
            $data = $sellers;
        }

        if ($request->has('supplier')) {
            $suppliers = Supplier::query();
            $supplier = $request->supplier;
            $suppliers->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($supplier) . "%"]);
            $suppliers = $suppliers->get();
            $data = $suppliers;

            if ($request->has('category')) {
                $categorys = Category::query();
                $category = $request->category;
                $categorys->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($category) . "%"]);
                if ($request->has('supplierId')) {
                    $categorys->where('supplier_id', $request->supplierId);
                }
                $categorys = $categorys->get();
                $data = $categorys;

                if ($request->has('product')) {
                    $products = Product::query();
                    $product = $request->product;
                    $products->whereRaw('LOWER(title) LIKE ?', ["%" . strtolower($product) . "%"]);
                    if ($request->has('categoryId')) {
                        $products->where('category_id', $request->categoryId);
                    }
                    $products = $products->get();
                    $data = $products;
                }
            }

            if ($request->has('brand')) {
                $brands = Brand::query();
                $brand = $request->brand;
                $brands->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($brand) . "%"]);
                $brands = $brands->get();
                $data = $brands;

                if ($request->has('product')) {
                    $products = Product::query();
                    $product = $request->product;
                    $products->whereRaw('LOWER(title) LIKE ?', ["%" . strtolower($product) . "%"]);
                    if ($request->has('brandId')) {
                        $products->where('brand_id', $request->brandId);
                    }
                    $products = $products->get();
                    $data = $products;
                }
            }

        }

        return response()->json([
            'data' => $data,
        ]);
    }

    public function create(Request $request)
    {
        $couponName = Coupon::whereNULL('deleted_at')->where('name', $request->name)->count();
        if ($couponName > 0) {
            return response()->json(['message' => 'Já existe um cupom com este nome.'], 400);
        }

        if ($request->product) {
            $productHasPromotion = Product::where('id', $request->product)->first();

            if ($productHasPromotion->unit_price_promotional != null || $productHasPromotion->box_price_promotional != null) {
                return response()->json(['message' => 'Produto em Promoção!.'], 400);
            }
        }
        if ($request->porcent > 100) {
            return response()->json(['message' => 'Porcetagem não pode ser maior que 100!.'], 400);
        }

        $coupon = Coupon::create([
            'name' => $request->name,
            'description' => $request->description ?? NULL,
            'discount_value' => $request->value ?? NULL,
            'price' => $request->price ?? NULL,
            'price_type' => $request->price_type ?? NULL,
            'discount_porc' => $request->porcent ?? NULL,
            'client_id' => $request->buyer ?? NULL,
            'period' => $request->period ?? NULL,
            //  'buyer_id' => $request->buyer ?? NULL,
            'product_id' => $request->product ?? NULL,
            'category_id' => $request->category ?? NULL,
            'client_profile_id' => $request->comercial_profile ?? NULL,
            'seller_id' => $request->seller ?? NULL,
            'client_group_id' => $request->group ?? NULL,
            'shipping_company_id' => $request->shipping_company ?? NULL,
            'supplier_id' => $request->supplier ?? NULL,
            'validate' => $request->validate ?? NULL,
            'brand_id' => $request->brand ?? NULL,
            'type' => $request->type ?? NULL,
        ]);

        return response()->json(['message' => 'Cupom criado!.']);
    }

    public function show(Coupon $coupon)
    {
        $oneMonthAgo = Carbon::now()->subMonth();
        $perPage = 15; // Define the number of results per page
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $coupon->load([
            'buyer',
            'client',
            'product',
            'brand',
            'shipping',
            'seller',
            'category',
            'supplier',
            'clientProfile',
            'clientGroup',
            'statuses'
        ]);

        $query = Client::with(['buyer', 'seller', 'couponStatus'])->where('commercial_status', 'Ativa');

        if ($coupon->buyer_id) {
            $query->orWhereIn('id', function ($subQuery) use ($coupon) {
                $subQuery->select('client_id')
                    ->from('buyer_client')
                    ->where('buyer_id', $coupon->buyer_id);
            });
        }

        if ($coupon->client_profile_id) {
            $query->orWhere('client_profile_id', $coupon->client_profile_id);
        }

        if ($coupon->client_id) {
            $query->orWhere('id', $coupon->client_id);
        }

        if ($coupon->client_group_id) {
            $query->orWhere('client_group_id', $coupon->client_group_id);
        }

        if ($coupon->seller_id) {
            $query->orWhere('seller_id', $coupon->seller_id);
        }

        if ($coupon->type == 1) {
            $query->orWhere('created_at', '>=', Carbon::now()->subDays($coupon->period));
        }

        if ($coupon->type == 2) {
            $query->orWhereHas('orders', function ($subQuery) use ($oneMonthAgo, $coupon) {
                $subQuery->where('created_at', '<', Carbon::now()->subDays($coupon->period));
            });
        }

        $clients = $query->paginate($perPage, ['*'], 'page', $currentPage);

        foreach ($clients as $client) {
            $client->used_coupon = $client->couponStatus()->where('coupon_id', $coupon->id)->exists();
            $client->last_login = $client->buyer->updated_at ?? NULL;
            $client->last_order = $lastCreatedAt = $client->orders->last()->created_at ?? NULL;
        }

        return response()->json(['coupon' => $coupon, 'clients' => $clients]);
    }


    public function update(Request $request, Coupon $coupon)
    {
        if ($request->name !== null) {
            $coupon->name = $request->name;
        }

        if ($request->value !== null) {
            $coupon->discount_value = $request->value;
        }

        if ($request->price !== null) {
            $coupon->price = $request->price;
        }

        if ($request->porcent !== null) {
            $coupon->discount_porc = $request->porcent;
        }

        if ($request->buyer !== null) {
            $coupon->buyer_id = $request->buyer;
        }

        if ($request->product !== null) {
            $coupon->product_id = $request->product;
        }

        if ($request->category !== null) {
            $coupon->category_id = $request->category;
        }

        if ($request->seller !== null) {
            $coupon->seller_id = $request->seller;
        }

        if ($request->shipping_company !== null) {
            $coupon->shipping_company_id = $request->shipping_company;
        }

        if ($request->supplier !== null) {
            $coupon->supplier_id = $request->supplier;
        }

        if ($request->validate !== null) {
            $coupon->validate = $request->validate;
        }

        if ($request->brand !== null) {
            $coupon->brand_id = $request->brand;
        }

        if ($request->type !== null) {
            $coupon->type = $request->type;
        }

        $coupon->update();

        return response()->json(['message' => 'Operação bem-sucedida.']);
    }

    public function delete(Coupon $coupon)
    {
        $used = CouponStatus::where('coupon_id', $coupon->id)
            ->exists();
        if ($used) {
            return response()->json(['message' => 'Não pode deletar cupom já usado!.']);
        }
        $coupon->delete();

        return response()->json(['message' => 'Operação bem-sucedida.']);
    }

}
