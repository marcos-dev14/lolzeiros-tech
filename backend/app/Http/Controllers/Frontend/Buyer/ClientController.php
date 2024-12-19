<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientPdv;
use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\Role;
use App\Models\Supplier;
use App\Services\ClientSessionManager;
use Barryvdh\DomPDF\Facade\Pdf;
use Faker\Core\DateTime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;

class ClientController extends Controller
{
    public function __construct(private ClientSessionManager $_sessionManager)
    {
    }

    public function changeSelectedClient(Request $request): RedirectResponse
    {
        $allClients = $this->_sessionManager->getSessionAllClients();

        $newSelectedClient = $allClients->where('id', $request->client_id)->first();

        if (!$newSelectedClient) {
            return redirect()->back();
        }

        $this->_sessionManager->setSelectedClient($newSelectedClient);

        return redirect()->back();
    }

    public function orders(): View
    {
        $client = $this->getClient([
            'buyer',
            'seller',
            'orders' => function ($query) {
                return $query->opened();
            },
            'orders.coupon',
            'orders.supplier',
            'orders.products',
            'orders.orderStatuses',
            'orders.supplier.shippingType'
        ]);

        return view('pages.buyer.orders', compact('client'));
    }

    protected function getClient($with = []): ?Client
    {
        $selectedClient = $this->_sessionManager->getSessionSelectedClient();

        return Client::where('id', $selectedClient->id)->with($with)->first();
    }

    public function canceledOrders(): View
    {
        $client = $this->getClient([
            'orders' => function ($query) {
                return $query->canceled();
            },
            'orders.coupon',
            'orders.supplier',
            'orders.products',
            'orders.orderStatuses',
            'orders.supplier.shippingType'
        ]);

        return view('pages.buyer.canceledOrders', compact('client'));
    }

    public function closedOrders(): View
    {
        $client = $this->getClient([
            'orders' => function ($query) {
                return $query->closed();
            },
            'orders.coupon',
            'orders.supplier',
            'orders.products',
            'orders.orderStatuses',
            'orders.supplier.shippingType'
        ]);

        return view('pages.buyer.closedOrders', compact('client'));
    }

    public function support(): View
    {
        $client = $this->getClient();

        return view('pages.buyer.support', compact('client'));
    }

    public function company(): View
    {
        $client = $this->getClient();
        $pdvs = ClientPdv::pluck('name', 'id');

        return view(
            'pages.buyer.company',
            compact('client', 'pdvs')
        );
    }

    public function commercial(): View
    {
        $client = $this->getClient();
        $commercial = $client->seller;

        return view(
            'pages.buyer.commercial',
            compact('client', 'commercial')
        );
    }

    public function password(): View
    {
        $buyer = $this->_sessionManager->getBuyer();
        $roles = Role::pluck('name', 'id');

        return view('pages.buyer.password', compact('buyer', 'roles'));
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $requestData = $request->except('_method', '_token');
        $validator = Validator::make($requestData, [
            'name' => ['required', 'string'],
            'cellphone' => ['required', 'string'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'current_password' => 'nullable',
            'new_password' => ['required_with:current_password'],
            'new_password_confirmation' => ['required_with_all:current_password,new_password', 'same:new_password']
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('errorForm', $validator->errors()->getMessages());
        }

        $buyer = $this->_sessionManager->getBuyer();

        if ($requestData['new_password'] && $requestData['current_password']) {
            if (!Hash::check($requestData['current_password'], $buyer->password)) {
                return redirect()->back()->with('errorForm', ['current_password' => ['A senha atual está incorreta']]);
            }

            $requestData['password'] = $requestData['new_password'];
        }

        unset($requestData['current_password'], $requestData['new_password'], $requestData['new_password_confirmation']);

        $buyer->update($requestData);

        return redirect()->back()->with('success', 'Dados atualizados com sucesso.');
    }

    public function social(): View
    {
        $client = $this->getClient();

        return view('pages.buyer.social', compact('client'));
    }

    public function update(Request $request): RedirectResponse
    {
        $client = $this->getClient();

        $client->update($request->all());

        return redirect()->back();
    }

    public function downloadPDF(Request $request, string $orderCode)
    {
        $order = Order::with(
            'products',
            'shippingCompany',
            'supplier',
            'client.group',
            'client.contacts',
            'saleChannel',
            'seller',
            'coupon'
        )->where('code', $orderCode)->first();

        if (!$order) {
            abort(404);
        }

        $supplier = $order->supplier;
        $shippingCompany = $order->shippingCompany;
        $products = $order->products;
        $seller = $order->seller;
        $client = $order->client;
        $contact = $client->contacts->first();

        $internalAccess = (isset($request->internal) && $request->internal == 1);

        $data = compact(
            'order',
            'client',
            'supplier',
            'shippingCompany',
            'products',
            'seller',
            'contact',
            'internalAccess'
        );

        if ($request->view == 1) {
            return view('pdf.invoice-order', $data);
        }

        $fileName = "AugeAPP_{$supplier->name}_{$client->company_name}_$order->code.pdf";

        return Pdf::loadView('pdf.invoice-order', $data)->stream($fileName);
    }

    public function ordersImport(): View
    {
        $suppliers = Supplier::where('is_available', '=', 1)
        ->orderBy('name')
        ->get();

        return view('pages.buyer.import', compact('suppliers'));
    }

    public function cupons(Request $request)
    {
        $client = $this->getClient(['buyer', 'seller']);
        $availableCoupons = $this->getClientAvailableCoupons($client);
        $oneMonthAgo = Carbon::now()->subYear();
        $createdAt = Carbon::parse($client->created_at);
        if (isset($client->orders)) {
            $lastOrder = Carbon::parse($client->orders?->last()?->created_at);
        } else {
            $lastOrder = null;
        }

        foreach ($availableCoupons as $key => $item) {
            if ($item['type'] == 'Tipo: Novos Clientes') {
                $period = (int) $item['period'];
                if ($createdAt->lt(Carbon::now()->subDays($period))) {
                    unset($availableCoupons[$key]);
                }
            }

            if ($item['type'] == 'Tipo: Retorno') {
                $period = (int) $item['period'];
                if ($lastOrder !== null && $lastOrder->lt(Carbon::now()->subDays($period))) {
                    unset($availableCoupons[$key]);
                }
            }

            if ($request->countCoupons) {
                $countCoupons = $availableCoupons->count();
                return response()->json([
                    'mensagem' => "você tem '.$countCoupons.' cupons disponivel!",
                    'coupons' => $countCoupons
                ]);
            }
        }
        return view('pages.buyer.cupons', compact('client', 'availableCoupons'));
    }

    public function getClientAvailableCoupons(Client $client)
    {

        $buyer = $this->_sessionManager->getBuyer();
        $createdAt = Carbon::parse($client->created_at);
        $oneMonthAgo = Carbon::now()->subYear();

        if (isset($client->orders)) {
            $lastOrder = Carbon::parse($client->orders?->last()?->created_at);
        } else {
            $lastOrder = null;
        }


        /*   $type = null;

          if ($lastOrder !== null && $lastOrder->lt($oneMonthAgo)) {
              $type = 2;
          }

          if ($createdAt->gte($oneMonthAgo)) {
              $type = 1;
          }
   */

        $coupons = Coupon::with('statuses')
            ->where(function ($query) {
                // Verifica se todos os campos são nulos
                $query->whereNull('buyer_id')
                    ->whereNull('seller_id')
                    ->whereNull('client_id')
                    ->whereNull('client_profile_id')
                    ->whereNull('client_group_id');
            })
            ->orWhere(function ($query) use ($buyer, $client) {
                // Verifica se todos os campos correspondem ao comprador ou cliente e grupo correto
                $query->where(function ($query) use ($buyer) {
                    $query->where('buyer_id', $buyer->id)
                        ->orWhereNull('buyer_id');
                })
                     ->where(function ($query) use ($client) {
                    $query->where('seller_id', $client->seller->id)
                        ->orWhereNull('seller_id');
                })
                    ->where(function ($query) use ($client) {
                    $query->where('client_id', $client->id)
                        ->orWhereNull('client_id');
                })
                    ->where(function ($query) use ($client) {
                    $query->where('client_profile_id', $client->client_profile_id)
                        ->orWhereNull('client_profile_id');
                })
                    ->where(function ($query) use ($client) {
                    $query->where('client_group_id', $client->client_group_id)
                    ->orWhereNull('client_group_id');
                }) ;
            })
            ->get()
            ->collect();



        return $coupons->map(function ($coupon) use ($client) {
            $isUsed = $coupon->statuses->where('client_id', $client->id)->count() > 0;
            $couponValidity = Carbon::parse($coupon->validate);

            $validityMessage = 'Cupom Vencido';
            if ($couponValidity->gt(now())) {
                $timeRemaining = $couponValidity->diff(now());
                if ($timeRemaining->days == 0) {
                    $validityMessage = $timeRemaining->h . "h " . $timeRemaining->i . "min";
                } else {
                    $validityMessage = $timeRemaining->days . " dias " . $timeRemaining->h . "h " . $timeRemaining->i . "min";
                }
            }

            if ($isUsed || (!$isUsed && $couponValidity->gt(now()))) {
                return [
                    'id' => $coupon->id,
                    'code' => $coupon->name,
                    'period' => $coupon->period ?? NULL,
                    'description' => $coupon->description,
                    'discount' => $coupon->discount_value ? 'R$: ' . $coupon->discount_value : ($coupon->discount_porc ? $coupon->discount_porc . ' %' : null),
                    'buyer' => $coupon->client ? 'Comprador: ' . ($coupon->client->company_name ?? $coupon->client->name) : null,
                    'product' => $coupon->product ? 'Produto: ' . $coupon->product->title : null,
                    'category' => $coupon->category ? 'Categoria: ' . $coupon->category->name : null,
                    'seller' => $coupon->seller ? 'Vendedor: ' . $coupon->seller->name : null,
                    'shipping_company' => $coupon->shipping ? 'Frete: ' . $coupon->shipping->name : null,
                    'supplier' => $coupon->supplier ? 'Fornecedor: ' . $coupon->supplier->name : null,
                    'client_group' => $coupon->clientGroup ? 'Grupo: ' . $coupon->clientGroup->name : null,
                    'brand' => $coupon->brand ? 'Marca: ' . $coupon->brand->name : null,
                    'client_profile' => $coupon->clientProfile ? 'Perfil: ' . $coupon->clientProfile->name : null,
                    'type' => $coupon->type == 1 ? 'Tipo: Novos Clientes' : ($coupon->type == 2 ? 'Tipo: Retorno' : null),
                    'validate' => $validityMessage,
                    'already_used' => $isUsed ? 'usado' : null,
                ];
            }

            return null;
        })->filter();
    }
}
