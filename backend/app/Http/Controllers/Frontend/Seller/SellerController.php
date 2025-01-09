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
        // $seller = auth()->guard('seller')->user()?->load([
        //     'ClientHasSeller.clientGroup',
        //     'ClientHasSeller.supplier',
        // ]);

        if (!$seller) {
            return redirect()->route('login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplierName = $clientHasSeller->supplier->company_name
                ?? $clientHasSeller->supplier->name
                ?? null;
            $lastLogin = Carbon::parse($clientHasSeller->clientGroup->buyer->last_login);

            return $clientHasSeller->clientGroup->clients->map(function ($client) use ($groupName, $supplierName, $lastLogin) {
                $mainAddress = $client->getMainAddress();
                $state = $mainAddress?->country_state_id
                    ? CountryState::find($mainAddress->country_state_id)
                    : null;

                return (object) [
                    'group' => $groupName,
                    'name' => $client->company_name ?? $client->name,
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
        // dd($clientDataPaginated);
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

        $clients = $seller->ClientHasSeller->map(function ($clientHasSeller) use ($seller) {
            $lastClient = null;
            $clientLastOrder = null;

            if ($clientHasSeller->clientGroup && $clientHasSeller->clientGroup->clients) {
                $clientHasSeller->clientGroup->clients->each(function ($client) use (&$clientLastOrder, &$lastClient) {
                    $lastOrder = $client->orders->last();
                    if ($lastOrder && (!$clientLastOrder || $lastOrder->created_at > $clientLastOrder->created_at)) {
                        $clientLastOrder = $lastOrder;
                        $lastClient = $client;
                    }
                });
            }

            if (!$lastClient) {
                $lastClient = $clientHasSeller->clientGroup->clients->first();
            }

            $mainAddress = $lastClient?->getMainAddress();
            $state = $mainAddress?->country_state_id
                ? CountryState::find($mainAddress->country_state_id)
                : null;

            $lastLogin = Carbon::parse($clientHasSeller->clientGroup->buyer->last_login ?? now());
            $suppliers = Supplier::query()
                ->where('is_available', 1)
                ->where('suspend_sales', 0)
                ->where('service_migrate', 'Ativado')
                ->has('installmentRules')
                ->get();

            $supplierData = $suppliers->map(function ($supplier) use ($clientHasSeller, $seller, $lastClient) {
                $isSellerClient = ClientHasSeller::where('client_group_id', $clientHasSeller->clientGroup->id)
                    ->where('supplier_id', $supplier['id'])
                    ->first();

                $mainAddress = $lastClient?->getMainAddress();
                $clientStateCode = $mainAddress?->state?->code;

                $stateDiscountFromClientState = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                    $query->where('code', $clientStateCode);
                })->first();

                $icmsDiscount = 0;
                if ($stateDiscountFromClientState instanceof SupplierDiscount) {
                    $icmsDiscount += floatval($stateDiscountFromClientState->discount_value);
                    $icmsDiscount += floatval($stateDiscountFromClientState->additional_value);
                }

                $clientProfile = $lastClient?->client_profile_id;
                $supplierDiscounts = $supplier->profileDiscounts;
                $discountToClientProfile = $supplierDiscounts->where('client_profile_id', $clientProfile)->first();

                return [
                    'name' => $supplier['name'],
                    ...($isSellerClient && ($isSellerClient->seller_id == $seller->id || $isSellerClient->seller_id === null) ?
                        [
                            'icms' => $icmsDiscount,
                            'profileDiscount' => $discountToClientProfile->discount_value ?? 0,
                            'commercial_commission' => $discountToClientProfile->commercial_commission ?? 0,
                            'fractional_box' => $supplier['fractional_box'] ?? 0
                        ] : []),
                ];
            });

            $hasProductsInCart = $lastClient?->cart?->products?->count() > 0;
            return $hasProductsInCart ? [
                'name' => $clientHasSeller->clientGroup->company_name ?? $clientHasSeller->clientGroup->name,
                'cnpj' => $lastClient?->document,
                'suppliers' => $supplierData,
                'state' => $state ? "{$state->name} - {$state->code}" : null,
                'register' => Carbon::parse($lastClient?->auge_register)->format('d/m/Y H:i'),
                'lastLogin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                'cartAbandoned' => $lastClient?->cart ? (new ClientListCartResource($lastClient?->cart))->created_at : null,
                'status' => $lastClient?->document_status,
                'clients' => $clientHasSeller->clientGroup->clients,
            ] : null;
        })->filter();

        $clientData = $clients->groupBy(function ($client) {
            return $client['name'] . '-' . $client['cnpj'];
        })->map(function ($group) {
            $mergedSuppliers = $group->flatMap(function ($client) {
                return $client['suppliers'];
            })->unique('name')->values()->toArray();

            $firstClient = $group->first();
            $firstClient['suppliers'] = $mergedSuppliers;

            return $firstClient;
        });

        $paginatedData = collect($clientData->values())->paginate(10);
        dd($paginatedData);
        return view('pages.sellers.abandonedCarts', [
            'seller' => $seller,
            'clientData' => $paginatedData,
        ]);
    }
}
