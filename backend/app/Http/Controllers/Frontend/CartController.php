<?php

namespace App\Http\Controllers\Frontend;

use App\Models\CartInstance;
use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use App\Services\CartService;
use App\Services\ClientSessionManager;
use App\View\Components\Header\CartBox;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;
use JetBrains\PhpStorm\NoReturn;
use Illuminate\Support\Str;
use Throwable;
use App\Jobs\ProcessImportJob;

class CartController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private ClientSessionManager $_sessionManager,
        private CartService $_cartService
    ) {
        parent::__construct();

        $this->setPageSeo();
    }

    public function showCart(Request $request): View
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        $client->load('group');
        $revalidated = $request->has('rv');
        $cart = $revalidated ? $this->_cartService->getFullCart($client) : [];

        $this->_cartService->setSessionCart($client);

        return view('pages.cart.index', compact('revalidated', 'cart'));
    }

    /**
     * @throws Throwable
     */
    public function add(Request $request): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();

        if (!$client) {
            session()->put('url.intended', url()->previous());

            return response()->json(['redirect_url' => route('buyer.login')]);
        }

        $product = Product::with('supplier')->find($request->product);

        try {
            $instance = $this->_cartService->addOrUpdateToCart(
                $client,
                $product,
                $request->qty ?? 1,
                true
            );
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Este produto não está disponível'
            ]);
        }

        $this->_cartService->setSessionCart($client);
        $this->_cartService->setSessionSupplier($product->supplier?->id);

        return response()->json([
            'message' => 'Produto adicionado ao carrinho.',
            'updateUrl' => route('cart.update'),
            'removeUrl' => route('cart.remove', [$instance?->uuid, $request->product]),
            'currentQuantity' => $request->qty ?? 1,
            'instance' => $instance?->uuid
        ], 201);
    }

    public function reOrder(Request $request): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        $log = [];

        if (!$client) {
            session()->put('url.intended', url()->previous());

            return response()->json(['redirect_url' => route('buyer.login')]);
        }
        $order = Order::with('products', 'supplier')->where('id', $request->id)->first();

        if ($order && $order->products->count() > 0) {
            foreach ($order->products as $productList) {
                $supplier = Supplier::where('id', $order->supplier->id)->where('is_available', 1)->first();
                if (empty($supplier)) {
                    $log[] = 'Fornecedor inativo!';

                    break;
                }
                $product = Product::with('supplier')
                    ->where('supplier_id', $order->supplier->id)
                    ->where('reference', $productList->reference)
                    ->whereNotIn('availability', ['Indisponível', 'Fora de linha', 'Em cadastro'])
                    ->first();

                if ($product) {
                    $instance = $this->_cartService->addOrUpdateToCart(
                        $client,
                        $product,
                        $productList->qty ?? 1,
                        true
                    );

                    $this->_cartService->setSessionCart($client);
                    $this->_cartService->setSessionSupplier($product->supplier?->id);
                    $log[] = $productList->title . ' Produto adicionado';
                } else {
                    $log[] = $productList->title . ' Produto não existe ou indisponivel';
                }

            }

        } else {
            $log[] = 'Pedido invalido!';
        }

        return response()->json([
            'message' => 'Log gerado!.',
            'log' => $log
        ], 201);
    }

    public function upload(Request $request): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();

        if (!$client) {
            session()->put('url.intended', url()->previous());
            return response()->json(['redirect_url' => route('buyer.login')]);
        }

        if (!$request->hasFile('fileToUpload')) {
            return response()->json(['error' => 'Arquivo não enviado'], 400);
        }

        $file = $request->file('fileToUpload');
        $extension = $file->getClientOriginalExtension();

        if (!in_array($extension, ['xlsx', 'xls', 'csv'])) {
            return response()->json(['error' => 'Formato de arquivo não suportado'], 400);
        }

        $filePath = $file->store('public/import-orders');
        $supplierId = $request->supplier_id;
        $importId = Str::uuid()->toString();
        ProcessImportJob::dispatch($filePath, $client->id, $supplierId, $importId);

        return response()->json([
            'message' => 'Iniciando a importação do seu pedido.',
            'import_id' => $importId,
            'supplier_id' => $supplierId,
        ], 201);
    }

    public function progress(Request $request): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();

        if (!$client) {
            return response()->json(['error' => 'Cliente não autenticado'], 403);
        }

        $supplierId = $request->get('supplier_id');
        $importId = $request->get('import_id');

        if (!$supplierId || !$importId) {
            return response()->json(['error' => 'Dados insuficientes'], 400);
        }

        $sessionKey = "import_progress_{$client->id}_{$supplierId}_{$importId}";
        $progress = Cache::get($sessionKey, 0);

        return response()->json(['progress' => $progress]);
    }

    public function logs(Request $request): JsonResponse
    {
        $supplierId = $request->input('supplier_id');
        $importId = $request->get('import_id');
        $client = $this->_sessionManager->getSessionSelectedClient();

        if (!$client) {
            return response()->json(['error' => 'Cliente não autenticado'], 403);
        }

        $logKey = "import_logs_{$client->id}_{$supplierId}_{$importId}";
        $logs = Cache::get($logKey, []);

        return response()->json(['logs' => $logs]);
    }

    /**
     * @throws Throwable
     */
    public function update(Request $request): JsonResponse
    {
        $addResponse = $this->add($request);

        if (!empty($addResponse->content()) && str_contains($addResponse->content(), 'error')) {
            return $addResponse;
        }

        $instance = CartInstance::with('cart', 'products')
            ->withSum('products', 'subtotal')
            ->withSum('products', 'subtotal_with_ipi')
            ->withSum('products', 'qty')
            ->withSum('products', 'ipi_value')
            ->withSum('products', 'discount')
            ->where('uuid', $request->instance)
            ->first();

        if (!$instance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carrinho invalido.'
            ], 404);
        }

        $instanceProduct = $instance->products->where('product_id', $request->product)->first();

        if (!$instanceProduct) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado.'
            ], 404);
        }

        $supplierMinOrder = $instance->supplier->min_order;
        $subtotalWithIpi = $instance->products_sum_subtotal_with_ipi;

        return response()->json([
            'ipi' => $instanceProduct->ipi,
            'discount' => $instanceProduct->discount,
            'discountPercentage' => $instanceProduct->discount_percentage * -1,
            'basePrice' => $instanceProduct->original_price,
            'discountedPrice' => $instanceProduct->unit_price,
            'discountedPriceWithIpi' => $instanceProduct->unit_price_with_ipi,
            'subtotal' => $instanceProduct->subtotal,
            'subtotalWithIpi' => $instanceProduct->subtotal_with_ipi,
            'currentQuantity' => $instanceProduct->qty,
            'instanceSubtotalDiscount' => formatMoney($instance->products_sum_discount),
            'instanceCountProducts' => $instance->products->count(),
            'instanceCountItems' => (int) $instance->products_sum_qty,
            'instanceSubtotal' => formatMoney($instance->products_sum_subtotal),
            'instanceSubtotalWithIpi' => formatMoney($subtotalWithIpi),
            'instanceIpiValue' => formatMoney($instance->products_sum_ipi_value),
            'instanceDiscount' => formatMoney($instance->products_sum_discount),
            'minOrderRemaining' => (!empty($supplierMinOrder) && $subtotalWithIpi < $supplierMinOrder)
                ? formatMoney($supplierMinOrder - $subtotalWithIpi) : 0,
            'minOrderRemainingPercentage' => ($subtotalWithIpi >= $supplierMinOrder)
                ? 100 : (($subtotalWithIpi / $supplierMinOrder) * 100),
            'message' => 'Carrinho atualizado com sucesso'
        ]);
    }


    public function updateData(Request $request, string $instanceUuid): JsonResponse
    {
        try {
            $instance = CartInstance::where('uuid', $instanceUuid)->first();
            $instance->update(
                $request->only('supplier_installment_rule_id')
            );
        } catch (Exception $e) {
            dd($e->getMessage());
        }

        return response()->json();
    }

    public function remove(string $instanceUuid, int $productId): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        if (!$client) {
            session()->put('url.intended', url()->previous());
            return response()->json([
                'redirect_url' => route('buyer.login')
            ]);
        }

        $instance = CartInstance::with('cart')
            ->withSum('products', 'subtotal')
            ->withSum('products', 'subtotal_with_ipi')
            ->withSum('products', 'qty')
            ->withSum('products', 'ipi_value')
            ->withSum('products', 'discount')
            ->where('uuid', $instanceUuid)->first();

        if (!$instance) {
            return response()->json([
                'status' => 'error',
                'message' => 'O produto não está presente no carrinho.'
            ]);
        }

        $cart = $instance->cart;
        abort_if($cart->client_id !== $client->id, 401);

        $this->_cartService->removeToCart($client, $productId, $instance);

        $product = Product::find($productId);

        $instance->load('products')
            ->loadSum('products', 'subtotal')
            ->loadSum('products', 'subtotal_with_ipi')
            ->loadSum('products', 'qty')
            ->loadSum('products', 'ipi_value')
            ->loadSum('products', 'discount');

        $prices = $product->getPriceWithPromotionDiscounts();

        $supplierMinOrder = $instance->supplier->min_order;
        $subtotalWithIpi = $instance->products_sum_subtotal_with_ipi;

        return response()->json([
            'status' => 'success',
            'ipi' => $prices['ipi'],
            'basePrice' => formatMoney($prices['original_price']),
            'discountedPrice' => formatMoney($prices['unit_price']),
            'discountedPriceWithIpi' => formatMoney($prices['unit_price_with_ipi']),
            'subtotal' => formatMoney($prices['subtotal']),
            'subtotalWithIpi' => formatMoney($prices['subtotal_with_ipi']),
            'discount' => formatMoney($prices['price_difference']),
            'discountPercentage' => $prices['discount_percentage'] * -1,
            'add_url' => route('cart.add'),
            'instanceCountItems' => $instance->products_sum_qty ?? 0,
            'instanceCountProducts' => $instance->products->count() ?? 0,
            'instanceSubtotal' => formatMoney($instance->products_sum_subtotal),
            'instanceSubtotalWithIpi' => formatMoney($subtotalWithIpi),
            'instanceIpiValue' => formatMoney($instance->products_sum_ipi_value),
            'instanceDiscount' => formatMoney($instance->products_sum_discount),
            'minOrderRemaining' => (!empty($supplierMinOrder) && $subtotalWithIpi < $supplierMinOrder)
                ? formatMoney($supplierMinOrder - $subtotalWithIpi) : 0,
            'minOrderRemainingPercentage' => ($subtotalWithIpi >= $supplierMinOrder)
                ? 100 : (($subtotalWithIpi / $supplierMinOrder) * 100),
        ]);
    }

    public function removeAll(string $instanceUuid)
    {

        $client = $this->_sessionManager->getSessionSelectedClient();
        if (!$client) {
            session()->put('url.intended', url()->previous());
            return response()->json([
                'redirect_url' => route('buyer.login')
            ]);
        }

        $instance = CartInstance::with('cart')->where('uuid', $instanceUuid)->first();

        if (!$instance) {
            return response()->json([
                'status' => 'error',
                'message' => 'O produto não está presente no carrinho.'
            ]);
        }

        $cart = $instance->cart;
        abort_if($cart->client_id !== $client->id, 401);

        $this->_cartService->removeToCartAll($client, $instance);
        /* $product = Product::find($productId);

        $instance->load('products')
            ->loadSum('products', 'subtotal')
            ->loadSum('products', 'subtotal_with_ipi')
            ->loadSum('products', 'qty')
            ->loadSum('products', 'ipi_value')
            ->loadSum('products', 'discount');

        $prices = $product->getPriceWithPromotionDiscounts();

        $supplierMinOrder = $instance->supplier->min_order;
        $subtotalWithIpi = $instance->products_sum_subtotal_with_ipi;
 */
        /* return response()->json([
            'status' => 'success',
            'ipi' => $prices['ipi'],
            'basePrice' => formatMoney($prices['original_price']),
            'discountedPrice' => formatMoney($prices['unit_price']),
            'discountedPriceWithIpi' => formatMoney($prices['unit_price_with_ipi']),
            'subtotal' => formatMoney($prices['subtotal']),
            'subtotalWithIpi' => formatMoney($prices['subtotal_with_ipi']),
            'discount' => formatMoney($prices['price_difference']),
            'discountPercentage' => $prices['discount_percentage'] * -1,
            'add_url' => route('cart.add'),
            'instanceCountItems' => $instance->products_sum_qty ?? 0,
            'instanceCountProducts' => $instance->products->count() ?? 0,
            'instanceSubtotal' => formatMoney($instance->products_sum_subtotal),
            'instanceSubtotalWithIpi' => formatMoney($subtotalWithIpi),
            'instanceIpiValue' => formatMoney($instance->products_sum_ipi_value),
            'instanceDiscount' => formatMoney($instance->products_sum_discount),
            'minOrderRemaining' => (!empty($supplierMinOrder) && $subtotalWithIpi < $supplierMinOrder)
                ? formatMoney($supplierMinOrder - $subtotalWithIpi) : 0,
            'minOrderRemainingPercentage' => ($subtotalWithIpi >= $supplierMinOrder)
                ? 100 : (($subtotalWithIpi / $supplierMinOrder) * 100),
        ]); */
        return redirect()->route('cart.index', compact('cart'));
    }

    public function showPreOrder(string $instanceUuid): View|RedirectResponse
    {
        $instance = CartInstance::with('cart')->where('uuid', $instanceUuid)->first();

        if (!$instance) {
            return redirect()->route('index');
        }

        $cart = $instance->cart;

        $client = $this->_sessionManager->getSessionSelectedClient();
        $client = Client::with('group')->find($client['id']);
        $clientBillingData = $this->getClientBillingData($client);

        if ($cart->client_id !== $client->id || $instance->cart_id !== $cart->id) {
            abort(401);
        }

        $cart = $this->_cartService->getFullCart($client, ['id', '=', $instance->id]);
        $instance = $cart->instances->first();

        $supplier = Supplier::find($instance->supplier->id);
        if ($instance->products_sum_subtotal_with_ipi < $supplier->min_order) {
            return redirect()->route('cart.index');
        }

        $shippingCompanies = $this->getShippingCompanies($supplier);

        $instance->installmentRules = $this->getInstallmentRules(
            supplier: $instance->supplier,
            client: $client,
            instance: $instance
        );

        return view(
            'pages.cart.order',
            compact(
                'client',
                'instance',
                'shippingCompanies',
                'clientBillingData'
            )
        );
    }

    protected function getClientBillingData(Model|Client $client): object
    {
        return (object) [
            'name' => $client->company_name ?? $client->name ?? $client?->buyer?->name,
            'address' => $client?->main_address,
            'email' => $client->corporate_email ?? $client?->buyer?->email,
            'phone' => $client?->buyer?->cellphone,
            'document' => $client?->document
        ];
    }

    protected function getInstallmentRules(Supplier $supplier, Model|Client $client, CartInstance $instance): array|Collection
    {
        $installmentRulesList = $supplier->installmentRules()->where(function ($query) use ($client, $instance) {
            return $query
                ->where(function ($query) use ($client) {
                    $query->where('client_id', $client->id)
                        ->orWhere('client_group_id', $client->client_group_id)
                        ->orWhere(function ($subquery) {
                            $subquery->whereNull('client_id')->whereNull('client_group_id');
                        });
                });
        })->get();

        $installmentRules = collect([]);

        foreach ($installmentRulesList as $rule) {
            $ruleInstallments = $rule->installments;
            $ruleInstallmentsCount = count(explode('/', $ruleInstallments));

            $temp = [
                'id' => $rule->id,
                'count_installments' => $ruleInstallmentsCount,
                'installments' => $ruleInstallments,
                'discount' => (float) $rule->discount_value,
                'additional' => (float) $rule->additional_value
            ];

            $installmentRules->push($temp);
        }

        return $installmentRules;
    }

    protected function getShippingCompanies(Supplier $supplier): Collection
    {
        $shippingCompanies = collect([]);
        if ($supplier->shipping_type_id == 1) {
            $shippingCompanies = ShippingCompany::orderBy('company_name')->pluck('company_name', 'id');
            $shippingCompanies->prepend('Cadastrar Novo', 'new');
        }

        return $shippingCompanies;
    }

    public function refreshCartProducts(): JsonResponse
    {
        $client = $this->_sessionManager->getSessionSelectedClient();
        $client->loadMissing('group');
        $cart = $this->_cartService->getFullCart($client);
        $revalidated = false;

        $cart->instances = $cart->instances->filter(
            fn($instance) => $client->canBuyFromSupplier($instance->product_supplier_id)['can']
        );

        $cacheKey = "CART_LAST_REFRESH_$cart->id";
        $lastRrefresh = Cache::get($cacheKey);

        $successReturn = ['status' => 'success', 'message' => 'Carrinho validado com sucesso'];

        if (!empty($lastRrefresh) && $lastRrefresh->gt(now()->addMinutes(-10))) {
            return response()->json(['status' => 'success', 'message' => 'Validação não necessária']);
        }

        foreach ($cart->instances as $instance) {
            foreach ($instance->products as $product) {
                try {
                    if ($product->updated_at->gte(now()->startOfDay())) {
                        continue;
                    }

                    $this->_cartService->addOrUpdateToCart(
                        client: $client,
                        product: $product->product,
                        qty: $product->qty,
                        clearQuantity: true
                    );

                    $revalidated = true;
                } catch (Exception | Throwable $e) {
                    if ($e->getMessage() !== "Este produto não está mais disponível") {
                        Log::error("Erro no arquivo " . __FILE__ . ' no método ' . __METHOD__ . ' e linha ' . __LINE__ . ": {$e->getMessage()}");
                    }

                    $product->delete();
                }
            }
        }

        Cache::put($cacheKey, now(), now()->addMinutes(10));
        return response()->json($successReturn + ['revalidated' => $revalidated]);
    }

    public function getUpdatedCartBoxHtml(Request $request): View
    {
        $isMobile = view()->shared('isMobile');

        $view = !empty($isMobile) && $isMobile == 'true' ? 'components.cart-box-mobile' : 'components.cart-box';

        $client = $this->_sessionManager->getSessionSelectedClient();
        if ($client) {
            $this->_cartService->setSessionCart($client);
        }

        return view($view, [
            'cartBox' => new CartBox(),
        ]);
    }
}
