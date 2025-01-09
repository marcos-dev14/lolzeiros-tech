<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientListCartResource;
use App\Http\Resources\OrderResource;
use App\Models\ClientHasSeller;
use App\Models\CountryState;
use App\Models\Order;
use App\Models\Seller;
use App\Models\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\SupplierDiscount;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function __construct(private Seller $entityService) {}

    public function clients()
    {
        $seller = auth()->guard('seller')->user()?->load([
            'ClientHasSeller.clientGroup',
            'ClientHasSeller.supplier',
        ]);

        if (!$seller) {
            return redirect()->route('login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) use ($seller) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplierName = $clientHasSeller->supplier->company_name
                ?? $clientHasSeller->supplier->name
                ?? null;

            $lastLogin = Carbon::parse($clientHasSeller->clientGroup->buyer->last_login);

            return $clientHasSeller->clientGroup->clients->map(function ($client) use ($groupName, $supplierName, $lastLogin, $clientHasSeller, $seller) {
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



    public function orders()
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()->route('login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $orders = Order::where('seller_id', $seller->id)
            ->orderBy('created_at', 'desc')
            ->with('supplier', 'client')
            ->paginate(10)
            ->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return (object) [
                'code' => $order->code,
                'cliente' => $order->client->company_name ?? $order->client->name,
                'fornecedor' => $order->supplier->company_name ?? $order->supplier->name ?? null,
                'data' => Carbon::parse($order->created_at)->format('d/m/Y H:i'),
                'valor' => $order->getTotalValue(),
                'status' => $order->getCurrentStatusAttribute(),
            ];
        });

        return view('pages.sellers.orders', compact('seller', 'orders'));
    }

    public function order($orderCode)
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()->route('login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $order = Order::where('code', $orderCode)->first();
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
            return redirect()->route('login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) use ($seller) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplierName = $clientHasSeller->supplier->company_name
                ?? $clientHasSeller->supplier->name
                ?? null;

            $lastLogin = optional($clientHasSeller->clientGroup->buyer)->last_login
                ? Carbon::parse($clientHasSeller->clientGroup->buyer->last_login)
                : null;

            return $clientHasSeller->clientGroup->clients->map(function ($client) use ($groupName, $supplierName, $lastLogin, $clientHasSeller, $seller) {
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
                        'profile' => $client->profile->name ?? null,
                        'suppliers' => $suppliersData,
                        'document' => $client->document ?? null,
                        'state' => $state ? "{$state->name} - {$state->code}" : null,
                        'register' => optional($client->auge_register)->format('d/m/Y H:i'),
                        'lastLogin' => $lastLogin ? $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')' : null,
                        'cartAbandoned' => $client->cart?->products->count() ? (new ClientListCartResource($client->cart))->created_at : null,
                        'status' => $client->document_status,
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
}
