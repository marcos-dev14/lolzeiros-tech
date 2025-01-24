<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientListCartResource;
use App\Http\Resources\OrderResource;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\ClientHasSeller;
use App\Models\CountryState;
use App\Models\Favoritable;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use App\Models\Seller;
use App\Models\Supplier;
use App\Services\FavoritableService;
use App\Services\SellerService;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\SupplierDiscount;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Jobs\ProcessClientData;

class SellerController extends Controller
{
    protected $favoritableService;
    public function __construct(private SellerService $entityService, FavoritableService $favoritableService)
    {
        $this->favoritableService = $favoritableService;
    }

    public function clients()
    {
        $seller = auth()->guard('seller')->user()?->load([
            'ClientHasSeller.clientGroup',
            'ClientHasSeller.supplier',
        ]);

        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $sellerId = Seller::with(['favoriteClients', 'favoriteOrders'])->find($seller->id);

        $favoriteClientsIds = $sellerId->favoriteClients->pluck('id')->toArray();

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) use ($seller, $favoriteClientsIds) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplierName = $clientHasSeller->supplier->company_name
                ?? $clientHasSeller->supplier->name
                ?? null;

            $lastLogin = Carbon::parse($clientHasSeller->clientGroup->buyer->last_login);

            return $clientHasSeller->clientGroup->clients->map(function ($client) use ($favoriteClientsIds, $groupName, $supplierName, $lastLogin, $clientHasSeller, $seller) {
                $suppliers = Supplier::query()
                    ->where('is_available', 1)
                    ->where('suspend_sales', 0)
                    ->where('service_migrate', 'Ativado')
                    ->has('installmentRules')
                    ->get();

                $suppliersData = $suppliers->map(function ($supplier) use ($client, $clientHasSeller, $seller) {
                    $isSellerClient = ClientHasSeller::where('client_group_id', $clientHasSeller->clientGroup->id)
                        ->where('supplier_id', $supplier['id'])
                        ->first();

                    $mainAddress = $client->getMainAddress();
                    $clientStateCode = $mainAddress?->state?->code;

                    $stateDiscount = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                        $query->where('code', $clientStateCode);
                    })->first();

                    $icmsDiscount = 0;
                    if ($stateDiscount instanceof SupplierDiscount) {
                        $icmsDiscount += floatval($stateDiscount->discount_value);
                        $icmsDiscount += floatval($stateDiscount->additional_value);
                    }

                    $clientProfile = $client->client_profile_id;
                    $profileDiscount = $supplier->profileDiscounts->where('client_profile_id', $clientProfile)->first();
                    $lastOrder = $client->orders
                        ->where('product_supplier_id', $supplier['id'])
                        ->last();

                    $lastBuy = $lastOrder?->created_at ?? null;
                    return (object) [
                        'name' => $supplier['name'],
                        ...($isSellerClient && ($isSellerClient->seller_id == $seller->id || $isSellerClient->seller_id === null) ?
                            [
                                'opportunity' => $isSellerClient->seller_id === null ?  1 : 0,
                                'icms' => $icmsDiscount,
                                'profile_discount' => $profileDiscount->discount_value ?? 0,
                                'commercial_commission' => $profileDiscount->commercial_commission ?? 0,
                                'fractional_box' => $supplier['fractional_box'] ?? 0,
                                'last_buy' => $lastBuy,
                            ] : []),
                    ];
                });

                $mainAddress = $client->getMainAddress();
                $state = $mainAddress?->country_state_id
                    ? CountryState::find($mainAddress->country_state_id)
                    : null;

                return (object) [
                    'group' => $groupName,
                    'client_id' => $client->id,
                    'name' => $client->company_name ?? $client->name,
                    'profile' => $client->profile->name  ?? null,
                    'suppliers' => $suppliersData,
                    'document' => $client->document ?? null,
                    'state' => $state ? "{$state->name} - {$state->code}" : null,
                    'register' => Carbon::parse($client->auge_register)->format('d/m/Y H:i'),
                    'lastLogin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                    'cartAbandoned' => $client->cart?->products?->count()
                        ? (new ClientListCartResource($client->cart))->created_at
                        : null,
                    'status' => $client->document_status,
                    'favorite' => in_array($client->id, $favoriteClientsIds) ? 1 : 0,
                ];
            });
        });

        $clientData = $clientData->groupBy(function ($client) {
            return $client->document . '-' . $client->group;
        })->map(function ($group) {
            return $group->first();
        });

        $currentPage = request()->get('page', 1);
        $perPage = 15;
        $clientDataPaginated = new LengthAwarePaginator(
            $clientData->forPage($currentPage, $perPage),
            $clientData->count(),
            $perPage,
            $currentPage,
            ['path' => request()->url()]
        );

        return view('pages.sellers.clients', [
            'seller' => $seller,
            'clients' => $clientDataPaginated,
        ]);
    }

    public function availableClients()
    {
        $seller = auth()->guard('seller')->user();
        set_time_limit(300);

        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $sellerId = Seller::with(['favoriteClients', 'favoriteOrders'])->find($seller->id);

        $favoriteClientsIds = $sellerId->favoriteClients->pluck('id')->toArray();

        $clientData = collect();


        $suppliers = Cache::remember('suppliers_available', 60, function () {
            return Supplier::query()
                ->where('is_available', 1)
                ->where('suspend_sales', 0)
                ->where('service_migrate', 'Ativado')
                ->has('installmentRules')
                ->get();
        });


        $clientHasSellers = ClientHasSeller::whereNull('seller_id')->inRandomOrder()->limit(100)->get();

        foreach ($clientHasSellers as $clientHasSeller) {
            $group = $clientHasSeller->clientGroup;

            if (!$group) {
                continue;
            }

            $lastLogin = Carbon::parse($group->buyer?->last_login);
            $groupName = $group->name;

            $group->clients->each(function ($client) use ($groupName, $suppliers, $seller, $lastLogin, $favoriteClientsIds, &$clientData) {
                $suppliersData = $suppliers->map(function ($supplier) use ($client, $seller) {
                    $isSellerClient = ClientHasSeller::where('client_group_id', $client->client_group_id)
                        ->where('supplier_id', $supplier->id)
                        ->first();

                    $mainAddress = $client->getMainAddress();
                    $clientStateCode = $mainAddress?->state?->code;

                    $stateDiscount = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                        $query->where('code', $clientStateCode);
                    })->first();

                    $icmsDiscount = 0;
                    if ($stateDiscount instanceof SupplierDiscount) {
                        $icmsDiscount += floatval($stateDiscount->discount_value);
                        $icmsDiscount += floatval($stateDiscount->additional_value);
                    }

                    $clientProfile = $client->client_profile_id;
                    $profileDiscount = $supplier->profileDiscounts->where('client_profile_id', $clientProfile)->first();

                    $lastOrder = $client->orders->where('product_supplier_id', $supplier->id)->last();
                    $lastBuy = $lastOrder?->created_at ?? null;

                    return (object) [
                        'name' => $supplier->name,
                        'opportunity' => $isSellerClient ? 0 : 1,
                        'icms' => $icmsDiscount,
                        'profile_discount' => $profileDiscount->discount_value ?? 0,
                        'commercial_commission' => $profileDiscount->commercial_commission ?? 0,
                        'fractional_box' => $supplier->fractional_box ?? 0,
                        'last_buy' => $lastBuy,
                    ];
                });

                $mainAddress = $client->getMainAddress();
                $state = $mainAddress?->country_state_id ? CountryState::find($mainAddress->country_state_id) : null;

                $clientData->push((object) [
                    'group' => $groupName,
                    'client_id' => $client->id,
                    'name' => $client->company_name ?? $client->name,
                    'profile' => $client->profile->name ?? null,
                    'suppliers' => $suppliersData,
                    'document' => $client->document ?? null,
                    'state' => $state ? "{$state->name} - {$state->code}" : null,
                    'register' => Carbon::parse($client->auge_register)->format('d/m/Y H:i'),
                    'lastLogin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                    'cartAbandoned' => $client->cart?->products?->count()
                        ? (new ClientListCartResource($client->cart))->created_at
                        : null,
                    'status' => $client->document_status,
                    'favorite' => in_array($client->id, $favoriteClientsIds) ? 1 : 0,
                ]);
            });
        }

        $clientData = Cache::remember('client_data_' . $seller->id, 60, function () use ($clientData) {
            return $clientData->groupBy(function ($client) {
                return $client->document . '-' . $client->group;
            })->map(function ($group) {
                return $group->first();
            });
        });

        $currentPage = request()->get('page', 1);
        $perPage = 15;
        $clientDataPaginated = new LengthAwarePaginator(
            $clientData->forPage($currentPage, $perPage),
            $clientData->count(),
            $perPage,
            $currentPage,
            ['path' => request()->url()]
        );

        return view('pages.sellers.clients', [
            'seller' => $seller,
            'clients' => $clientDataPaginated,
        ]);
    }



    public function orders()
    {
        //$seller = $this->entityService->getBy(3, 'id');
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $seller = Seller::with(['favoriteClients', 'favoriteOrders'])->find($seller->id);
        $favoriteOrderIds = $seller->favoriteOrders->pluck('id')->toArray();

        $filters = request()->all();
        unset($filters['page']);
        $query = Order::where('seller_id', $seller->id);

        $query = $this->applyFiltersOrders($query, $filters);

        $orders = $query->orderBy('created_at', 'desc')
            ->with('supplier', 'client')
            ->paginate(10)
            ->withQueryString();

        $orders->getCollection()->transform(function ($order) use ($favoriteOrderIds): object {
            $mainAddress = $order->client->getMainAddress();
            $state = $mainAddress?->country_state_id
                ? CountryState::find($mainAddress->country_state_id)
                : null;

            return (object) [
                'code' => $order->code,
                'order_id' => $order->id,
                'client_id' => $order->client->id,
                'client' => $order->client->company_name ?? $order->client->name,
                'supplier' => $order->supplier->company_name ?? $order->supplier->name ?? null,
                'state' => $state ? "{$state->name} - {$state->code}" : null,
                'date' => Carbon::parse($order->created_at)->format('d/m/Y'),
                'value' => $order->getTotalValue(),
                'status' => $order->getCurrentStatusAttribute(),
                'favorite' => in_array($order->id, $favoriteOrderIds) ? 1 : 0,
            ];
        });

        return view('pages.sellers.orders', compact('seller', 'orders'));
    }

    public function order($orderCode)
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $order = Order::with(
            'supplier',
            'coupon',
            'clientGroup',
            'seller',
            'buyer',
            'client.profile',
            'client.pdvType',
            'shippingCompany',
            'products.product.images',
            'orderStatuses',
            'saleChannel',
            'type',
            'addressState',
            'invoice',
            'invoices'
        )->where('code', $orderCode)->first();
        $order = new OrderResource($order);

        return view('pages.sellers.order', compact('seller', 'order'));
    }

    public function abandonedCarts()
    {
        $seller = auth()->guard('seller')->user()?->load([
            'ClientHasSeller.clientGroup',
            'ClientHasSeller.supplier',
        ]);

        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $sellerId = Seller::with(['favoriteClients', 'favoriteOrders'])->find($seller->id);

        $favoriteClientsIds = $sellerId->favoriteClients->pluck('id')->toArray();

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) use ($seller, $favoriteClientsIds) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplierName = $clientHasSeller->supplier->company_name
                ?? $clientHasSeller->supplier->name
                ?? null;

            $lastLogin = optional($clientHasSeller->clientGroup->buyer)->last_login
                ? Carbon::parse($clientHasSeller->clientGroup->buyer->last_login)
                : null;

            return $clientHasSeller->clientGroup->clients->map(function ($client) use ($groupName, $supplierName, $lastLogin, $clientHasSeller, $seller, $favoriteClientsIds) {
                $suppliers = Supplier::query()
                    ->where('is_available', 1)
                    ->where('suspend_sales', 0)
                    ->where('service_migrate', 'Ativado')
                    ->whereHas('installmentRules')
                    ->whereHas('ClientHasSeller', function ($query) use ($seller, $client) {
                        $query->where('seller_id', $seller->id)
                            ->where('client_group_id', $client->group->id);
                    })
                    ->get();

                $suppliersData = $suppliers->map(function ($supplier) use ($client, $clientHasSeller, $seller) {
                    $isSellerClient = ClientHasSeller::query()
                        ->where('client_group_id', $clientHasSeller->clientGroup->id)
                        ->where('supplier_id', $supplier->id)
                        ->first();

                    $mainAddress = $client->getMainAddress();
                    $clientStateCode = $mainAddress?->state?->code;

                    $stateDiscount = $supplier->stateDiscounts()
                        ->whereHas('states', fn($query) => $query->where('code', $clientStateCode))
                        ->first();

                    $icmsDiscount = optional($stateDiscount)->discount_value + optional($stateDiscount)->additional_value;

                    $profileDiscount = $supplier->profileDiscounts
                        ->where('client_profile_id', $client->client_profile_id)
                        ->first();

                    $lastOrder = $client->orders
                        ->where('product_supplier_id', $supplier->id)
                        ->last();

                    $cart = $client->cart?->instances && $client->cart->instances->where('product_supplier_id', $supplier->id)->isNotEmpty()
                        ? $client->cart->instances->where('product_supplier_id', $supplier->id)->first()
                        : null;

                    if ($cart) {
                        $cartCreatedAt = Carbon::parse($cart->created_at);
                        $daysSinceCartCreated = $cartCreatedAt->diffInDays(Carbon::now());
                        $value = $cart->products->sum(fn($product) => (float)$product->subtotal_with_ipi);

                        return (object) [
                            'name' => $supplier->company_name ?? $supplier->name,
                            'value' => $value,
                            'day' => $cartCreatedAt->format('d/m/Y'),
                            'days' => $daysSinceCartCreated,
                            'last_buy' => $lastOrder?->created_at,
                        ];
                    }
                })->filter();

                $mainAddress = $client->getMainAddress();
                $state = $mainAddress?->country_state_id
                    ? CountryState::find($mainAddress->country_state_id)
                    : null;

                if ($suppliersData->count() > 0) {
                    return (object) [
                        'group' => $groupName,
                        'name' => $client->company_name ?? $client->name,
                        'client_id' => $client->id,
                        'profile' => $client->profile->name ?? null,
                        'suppliers' => $suppliersData,
                        'document' => $client->document ?? null,
                        'state' => $state ? "{$state->name} - {$state->code}" : null,
                        'register' => optional($client->auge_register)->format('d/m/Y H:i'),
                        'lastLogin' => $lastLogin ? $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')' : null,
                        'cartAbandoned' => $client->cart?->products->count() ? (new ClientListCartResource($client->cart))->created_at : null,
                        'status' => $client->document_status,
                        'favorite' => in_array($client->id, $favoriteClientsIds) ? 1 : 0,
                    ];
                }
            })->filter();
        });

        $clientData = $clientData->groupBy(fn($client) => $client->document . '-' . $client->group)
            ->map(fn($group) => $group->first());

        $currentPage = request()->get('page', 1);
        $perPage = 15;

        $clientDataPaginated = new LengthAwarePaginator(
            $clientData->forPage($currentPage, $perPage),
            $clientData->count(),
            $perPage,
            $currentPage,
            ['path' => request()->url()]
        );

        return view('pages.sellers.abandonedCarts', [
            'seller' => $seller,
            'clients' => $clientDataPaginated,
        ]);
    }

    public function addFavoritable(Request $request)
    {
        $seller = auth()->guard('seller')->user()?->load([
            'ClientHasSeller.clientGroup',
            'ClientHasSeller.supplier',
        ]);

        if (!$seller) {
            return response()->json([
                'error' => 'Você precisa estar autenticado para acessar esta página.'
            ], 401);
        }

        $result = $this->favoritableService->addFavoritable(
            $request->type,
            $request->id,
            $seller->id
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['message'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ], 200);
    }

    public function removeFavoritable(Request $request)
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return response()->json([
                'error' => 'Você precisa estar autenticado para acessar esta página.'
            ], 401);
        }

        $result = $this->favoritableService->removeFavoritable(
            $request->type,
            $request->id,
            $seller->id
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['message'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ], 200);
    }

    /* private function applyFiltersOrders($query, $filters)
    {
        foreach ($filters as $key => $value) {
            if ($key === 'favoritables' && $value == 1) {
                $seller = auth()->guard('seller')->user();
                if ($seller) {
                    $favoriteOrderIds = Seller::find($seller->id)
                        ->favoriteOrders
                        ->pluck('id')
                        ->toArray();

                    $query->whereIn('id', $favoriteOrderIds);
                }
                continue;
            }

            if (str_contains($key, 'by_')) {
                $relation = str_replace('by_', '', $key);
                $query->where("{$relation}_id", $value);
                continue;
            }

            if ($key == 'date') {
                $date = explode('|', $value);
                $startDate = str_replace('start:', null, $date[0]);
                $endDate = str_replace('end:', null, $date[1]);

                $startDate = !empty($startDate) ? Carbon::parse($startDate)->startOfDay() : null;
                $endDate = !empty($endDate) ? Carbon::parse($endDate)->endOfDay() : null;

                if ($startDate && $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                } elseif ($startDate) {
                    $query->where('created_at', '>=', $startDate);
                } else {
                    $query->where('created_at', '<=', $endDate);
                }

                continue;
            }

            if ($key === 'code') {
                if (str_contains($value, 'codigo:')) {
                    $value = trim(str_replace('codigo:', '', $value));
                    $query->where('code', 'like', "%{$value}%");
                    continue;
                }

                if (str_contains($value, 'cliente:')) {
                    $value = trim(str_replace('cliente:', '', $value));
                    $query->whereHas('client', function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('company_name', 'like', "%{$value}%");
                    });
                    continue;
                }

                if (str_contains($value, 'fornecedor:')) {
                    $value = trim(str_replace('fornecedor:', '', $value));
                    $query->whereHas('supplier', function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('company_name', 'like', "%{$value}%");
                    });
                    continue;
                }

                 if (str_contains($value, 'cidade:')) {
                    $value = trim(str_replace('cidade:', '', $value));
                    $query->whereHas('client.address', function ($q) use ($value) {
                        $q->where('city', 'like', "%{$value}%");
                    });
                    continue;
                } 

                if (str_contains($value, 'estado:')) {
                    $value = trim(str_replace('estado:', '', $value));
                    $query->whereHas('client', function ($q) use ($value) {
                        $q->whereHas('addresses', function ($subQuery) use ($value) {
                            $subQuery->where('address_type_id', 1)  // Filtra pelo tipo de endereço principal
                                ->whereHas('state', function ($subQuery2) use ($value) {
                                    $subQuery2->where('name', 'like', "%{$value}%")
                                        ->orWhere('code', 'like', "%{$value}%");
                                });
                        });
                    });
                    continue;
                }
            }

            $query->where($key, $value);
        }

        return $query;
    } */

    public function getFilteredOrders(Request $request)
    {
        $seller = auth()->guard('seller')->user();
        if (!$seller) {
            return redirect()->route('buyer.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $seller = Seller::with(['favoriteClients', 'favoriteOrders'])->find($seller->id);
        $favoriteOrderIds = $seller->favoriteOrders->pluck('id')->toArray();

        $query = Order::where('seller_id', $seller->id);

        if ($request->filled('client_name') && $request->input('client_name') !== 'Selecione') {
            $query->byClientName($request->input('client_name'));
        }

        if ($request->filled('supplier_name') && $request->input('supplier_name') !== 'Selecione') {
            $query->bySupplierName($request->input('supplier_name'));
        }

        if ($request->filled('city_name') && $request->input('city_name') !== 'Selecione') {
            $query->byAddressCityName($request->input('city_name'));
        }

        if ($request->filled('document')) {
            $query->byClientDocument($request->input('document'));
        }

        if ($request->filled('status') && $request->input('status') !== 'Selecione') {
            $status = $request->input('status');
            $query->where('current_status', $status);
        }

        if ($request->filled('code') && $request->input('code') !== 'Selecione') {
            $query->where('code', 'like', '%' . $request->input('code') . '%');
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $dateFrom = Carbon::parse($request->input('date_from'))->startOfDay();
            $dateTo = Carbon::parse($request->input('date_to'))->endOfDay();
            $query->whereBetween('created_at', [$dateFrom, $dateTo]);
        } elseif ($request->filled('date_from')) {
            $dateFrom = Carbon::parse($request->input('date_from'))->startOfDay();
            $query->where('created_at', '>=', $dateFrom);
        } elseif ($request->filled('date_to')) {
            $dateTo = Carbon::parse($request->input('date_to'))->endOfDay();
            $query->where('created_at', '<=', $dateTo);
        }


        if ($request->filled('min_value') || $request->filled('max_value')) {
            $minValue = $request->input('min_value', 0);
            $maxValue = $request->input('max_value', PHP_INT_MAX);
            $query->whereBetween('total_value', [$minValue, $maxValue]);
        }

        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->input('sort_by'), $request->input('sort_order'));
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $orders = $query->paginate(10)->withQueryString();

        $orders->getCollection()->transform(function ($order) use ($favoriteOrderIds): object {
            $mainAddress = $order->client->getMainAddress();
            $state = $mainAddress?->country_state_id
                ? CountryState::find($mainAddress->country_state_id)
                : null;

            return (object) [
                'code' => $order->code,
                'order_id' => $order->id,
                'client_id' => $order->client->id,
                'client' => $order->client->company_name ?? $order->client->name,
                'supplier' => $order->supplier->company_name ?? $order->supplier->name ?? null,
                'state' => $state ? "{$state->name} - {$state->code}" : null,
                'date' => Carbon::parse($order->created_at)->format('d/m/Y'),
                'value' => $order->getTotalValue(),
                'status' => $order->getCurrentStatusAttribute(),
                'favorite' => in_array($order->id, $favoriteOrderIds) ? 1 : 0,
            ];
        });

        // Retorna a view com os dados
        return view('pages.sellers.orders', compact('seller', 'orders'));
    }
}
