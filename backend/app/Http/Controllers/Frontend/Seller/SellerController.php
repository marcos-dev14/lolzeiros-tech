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

        $clients = $seller->ClientHasSeller->map(function ($clientHasSeller) use ($seller) {
            $lastClient = null;
            $clientLastOrder = null;

            // Verifica o cliente com o último pedido mais recente entre todos os clientes do grupo
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

            // Mapeamento e correção no array de fornecedores
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
                        ['icms' => $icmsDiscount, 'profileDiscount' => $discountToClientProfile->discount_value ?? 0] : []),
                ];
            });

            return [
                'name' => $clientHasSeller->clientGroup->company_name ?? $clientHasSeller->clientGroup->name,
                'cnpj' => $lastClient?->document,
                'suppliers' => $supplierData,
                'state' => $state ? "{$state->name} - {$state->code}" : null,
                'register' => Carbon::parse($lastClient?->auge_register)->format('d/m/Y H:i'),
                'lastLogin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                'cartAbandoned' => $lastClient?->cart ? (new ClientListCartResource($lastClient?->cart))->created_at : null,
                'status' => $lastClient?->document_status,
                'clients' => $clientHasSeller->clientGroup->clients,
            ];
        });


        return view('pages.sellers.clients', [
            'seller' => $seller,
            'clients' => $clients,
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

        $clientData = $seller->ClientHasSeller->flatMap(function ($clientHasSeller) {
            $groupName = $clientHasSeller->clientGroup->name ?? null;
            $supplier = $clientHasSeller->supplier;
            $lastLogin = Carbon::parse($clientHasSeller->clientGroup->buyer->last_login);

            return $clientHasSeller->clientGroup->clients->filter(function ($client) {
                return $client->cart?->products?->count() > 0;
            })->map(function ($client) use ($groupName, $supplier, $lastLogin, $clientHasSeller) {
                $mainAddress = $client->getMainAddress();
                $clientStateCode = $mainAddress?->state?->code;
                $state = $mainAddress?->country_state_id
                    ? CountryState::find($mainAddress->country_state_id)
                    : null;
                $clientProfile = $client->client_profile_id;
                $supplierDiscounts = $supplier->profileDiscounts;
                $discountToClientProfile = $supplierDiscounts->where('client_profile_id', $clientProfile)->first();

                $stateDiscountFromClientState = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                    $query->where('code', $clientStateCode);
                })->first();

                $icmsDiscount = 0;
                if ($stateDiscountFromClientState instanceof SupplierDiscount) {
                    $icmsDiscount += floatval($stateDiscountFromClientState->discount_value);
                    $icmsDiscount += floatval($stateDiscountFromClientState->additional_value);
                }

                return (object) [
                    'grupo' => $groupName,
                    'fornecedores' => [[
                        'nome' => $supplier->company_name ?? $supplier->name,
                        'icms' => $icmsDiscount,
                        'discount' => $discountToClientProfile->discount_value ?? 0,
                    ]],
                    'cliente' => $client->company_name ?? $client->name,
                    'cnpj' => $client->document ?? null,
                    'estado' => $state ? "{$state->name} - {$state->code}" : null,
                    'cadastro' => Carbon::parse($client->auge_register)->format('d/m/Y H:i'),
                    'ultimologin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                    'carrinhoabandonado' => (new ClientListCartResource($client->cart))->created_at,
                    'status' => $client->document_status,
                    'carrinho' => $client->cart?->products?->count(),
                ];
            });
        });

        $clientData = $clientData->groupBy(function ($client) {
            return $client->cnpj . '-' . $client->grupo;
        })->map(function ($group) {
            $mergedSuppliers = $group->flatMap(function ($client) {
                return $client->fornecedores;
            })->unique('nome')->values()->toArray();

            $firstClient = $group->first();
            $firstClient->fornecedores = $mergedSuppliers;

            return $firstClient;
        });

        $clientDataPaginated = $clientData->forPage(request()->get('page', 1), 15);
        $total = $clientData->count();
        dd($clientDataPaginated);
        return view('pages.sellers.abandonedCarts', [
            'seller' => $seller,
            'clientData' => $clientDataPaginated,
            'total' => $total,
            'perPage' => 15,
        ]);
    }
}
