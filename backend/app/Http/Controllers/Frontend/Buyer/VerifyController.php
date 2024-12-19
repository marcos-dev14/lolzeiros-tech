<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class VerifyController extends Controller
{
    public function showVerificationForm(): View
    {
        return view('pages.buyer.verify-email');
    }

    public function sendEmailVerification(Request $request): RedirectResponse
    {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Verification link sent!');
    }

    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        $request->fulfill();

        return redirect()->route('buyer.company');
    }
}
