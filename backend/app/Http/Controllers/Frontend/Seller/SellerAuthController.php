<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Seller\AuthRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Throwable;

class SellerAuthController extends Controller
{
    private string $guard = 'seller';

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
}
