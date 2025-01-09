<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientListCartResource;
use App\Http\Resources\OrderResource;
use App\Models\CountryState;
use App\Models\Order;
use App\Models\Seller;
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
                    'grupo' => $groupName,
                    'fornecedor' => $supplierName,
                    'cliente' => $client->company_name ?? $client->name,
                    'cnpj' => $client->document ?? null,
                    'estado' => $state ? "{$state->name} - {$state->code}" : null,
                    'cadastro' => Carbon::parse($client->auge_register)->format('d/m/Y H:i'),
                    'ultimologin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                    'carrinhoabandonado' => $client->cart?->products?->count()
                        ? (new ClientListCartResource($client->cart))->created_at
                        : null,
                    'status' => $client->document_status,
                ];
            });
        });

        $clientData = $clientData->groupBy(function ($client) {
            return $client->cnpj . '-' . $client->grupo;
        })->map(function ($group) {
            $mergedSupplier = $group->pluck('fornecedor')->unique()->implode(', ');
            $firstClient = $group->first();
            $firstClient->fornecedor = $mergedSupplier;

            return $firstClient;
        });

        $clientDataPaginated = $clientData->forPage(request()->get('page', 1), 15); // 15 itens por página
        $total = $clientData->count();

        return view('pages.sellers.clients', [
            'seller' => $seller,
            'clientData' => $clientDataPaginated,
            'total' => $total,
            'perPage' => 15,
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
}
