<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Seller\AuthRequest;
use App\Models\Client;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Services\ApiDocumentResponseService;
use App\Services\CartService;
use App\Services\ClientSessionManager;
use Throwable;

class SellerAuthController extends Controller
{
    private string $guard = 'seller';

    public function __construct(
        private ClientSessionManager $_sessionManager,
        private CartService $_cartService,
        private ApiDocumentResponseService $_apiDocumentResponseService
    ) {}

    public function showLoginForm(): View|RedirectResponse
    {
        if (auth()->guard($this->guard)->user()) {
            return redirect()->intended(route('seller.dashboard'));
        }

        return view('pages.sellers.register');
    }

    public function login(AuthRequest $request): RedirectResponse
    {
        $credentials = $request->validated();

        if (!auth()->guard($this->guard)->attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']],
            $credentials['remember']
        )) {
            return back()->with('error', 'Os dados informados estão incorretos.');
        }


        $request->session()->regenerate();

        try {
            // Caso seja necessário realizar alguma configuração adicional após o login, adicione aqui.
        } catch (Throwable $exception) {
            auth()->guard($this->guard)->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->with('error', $exception->getMessage());
        }

        return redirect()->intended(route('seller.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->killSession($request);
        dd(auth()->guard($this->guard)->user());
        return redirect()->route('index');
    }

    protected function killSession(Request $request): void
    {
        auth()->guard($this->guard)->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }

    public function showSellerLoginForm(Request $request)
    {
        $this->killSession($request);

        $sellerEmail = $request->input('email');
        // $sellerToken = $request->input('token');
        $clientId = $request->input('client_id');

        $seller = Seller::where('email', $sellerEmail)->first();

        /*  if (!$this->validateSellerToken($seller, $sellerToken)) {
            return redirect()->route('buyer.showLoginForm')->with('error', 'Token de comercial inválido');
        } */

        $client = Client::select('id', 'seller_id', 'client_group_id')->with('buyer')->find($clientId);

        if (!$client) {
            return redirect()->route('buyer.showLoginForm')->with('error', 'Cliente não encontrado');
        }

        $buyer = $client->buyer;

        if (!$buyer) {
            return redirect()
                ->route('buyer.showLoginForm')
                ->with('error', 'Este cliente não possui um comprador vinculado');
        }

        //        if ($client->seller_id !== $seller->id) {
        //            return redirect()
        //                ->route('buyer.showLoginForm')
        //                ->with('error', 'O cliente informado não é atendido pelo comercial informado');
        //        }

        try {
            session()->put('logged_in_seller_id', $seller->id);
            
            $this->_sessionManager->loginUsingId($buyer->id);
            $this->_sessionManager->setSessionClient($client->id);
            $this->_cartService->setSessionCart(session()->get('buyer.clients.selected'));
        } catch (Throwable $exception) {
            $this->killSession($request);

            return redirect()->route('buyer.showLoginForm')->with('error', $exception->getMessage());
        }

        return redirect()->route('index');
    }
}
