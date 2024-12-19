<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\BankAccountRequest;
use App\Models\BankAccount;
use App\Models\Client;
use App\Services\BankAccountService;
use App\Services\BankService;
use App\Services\ClientSessionManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class ClientBankAccountController extends Controller
{
    public function __construct(
        protected ClientSessionManager $sessionManager,
        protected BankAccountService   $bankAccountService,
        protected BankService          $bankService
    ) {}

    protected function getClient(): ?Client
    {
        return $this->sessionManager->getSessionSelectedClient();
    }

    public function index(): View
    {
        $client = $this->getClient();

        return view('pages.buyer.bank_accounts.index', compact('client'));
    }

    public function create(): View
    {
        $client = $this->getClient();
        $banks = $this->bankService->all(false)->pluck('name', 'id');

        return view('pages.buyer.bank_accounts.create', compact('client', 'banks'));
    }

    public function store(BankAccountRequest $request): RedirectResponse
    {
        try {
            $client = $this->getClient();

            DB::beginTransaction();

            $bankAccount = new BankAccount($request->validated());
            $client->bankAccounts()->save($bankAccount);

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (\Exception| Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.bank_account.list');
    }

    public function edit(BankAccount $bankAccount): View
    {
        $client = $this->getClient();
        $banks = $this->bankService->all(false)->pluck('name', 'id');

        return view('pages.buyer.bank_accounts.edit', compact(
            'bankAccount',
            'client',
            'banks'
        ));
    }

    public function update(BankAccountRequest $request, BankAccount $bankAccount): RedirectResponse
    {
        try {
            $client = $this->getClient();

            if (!$bankAccount->bankable instanceof Client || $bankAccount->bankable->id !== $client->id) {
                return redirect()->back()
                    ->withErrors("Esta conta não pertence ao cliente selecionado")
                    ->withInput();
            }

            DB::beginTransaction();

            $this->bankAccountService->update($bankAccount, $request->validated());

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (\Exception| Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.bank_account.list');
    }

    /**
     * @throws Throwable
     */
    public function destroy(BankAccount $bankAccount): RedirectResponse
    {
        $client = $this->getClient();
        if (!$bankAccount->bankable instanceof Client || $bankAccount->bankable->id !== $client->id) {
            return redirect()->back()
                ->withErrors("Esta conta não pertence ao cliente selecionado")
                ->withInput();
        }

        $bankAccount->delete();

        try {
            $this->sessionManager->setSessionClient();
        } catch (Throwable $e) {
            return redirect()->back()
                ->with('errorForm', $e->getMessage())
                ->withInput();
        }

        return redirect()->back();
    }
}
