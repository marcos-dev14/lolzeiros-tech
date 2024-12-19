<?php

namespace App\Http\Controllers\Frontend\Buyer;

use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordController
{
    public function showRecoveryForm(): View|RedirectResponse
    {
        if (auth()->guard('buyer')->user()) {
            return redirect()->route('buyer.clients');
        }

        return view('auth.passwords.email');
    }

    public function sendEmailRecovery(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => [
                Rule::requiredIf(empty($request->document)),
                'string',
                'email'
            ],
            'document' => [
                Rule::requiredIf(empty($request->email)),
                'string',
                'min:14'
            ]
        ]);

        $status = $this->broker()->sendResetLink(
            $request->only('email', 'document')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with(['success' => __($status)])
            : back()->withErrors(['email' => __($status)]);
    }

    public function showRedefinitionForm(Request $request, string $token): View
    {
        $email = $request->email;

        return view('auth.passwords.reset', compact('token', 'email'));
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:4|confirmed',
        ]);

        $status = $this->broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => $password
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('buyer.login')->with('success', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }

    protected function broker(): PasswordBroker
    {
        return Password::broker('buyers');
    }
}
