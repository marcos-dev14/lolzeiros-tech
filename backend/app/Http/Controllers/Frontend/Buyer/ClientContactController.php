<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\ContactRequest;
use App\Models\Client;
use App\Models\Contact;
use App\Services\ClientSessionManager;
use App\Services\ContactService;
use App\Services\CountryStateService;
use App\Services\RoleService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class ClientContactController extends Controller
{
    public function __construct(
        protected ClientSessionManager $sessionManager,
        protected RoleService          $roleService,
        protected ContactService       $contactService,
        protected CountryStateService  $stateService,
    ) {}

    protected function getClient(): ?Client
    {
        return $this->sessionManager->getSessionSelectedClient();
    }

    public function index(): View
    {
        $client = $this->getClient();

        return view('pages.buyer.contacts.index', compact('client'));
    }

    public function create(): View
    {
        $client = $this->getClient();
        $roles = $this->roleService->all(false)->pluck('name', 'id');

        return view('pages.buyer.contacts.create', compact('client', 'roles'));
    }

    public function store(ContactRequest $request): RedirectResponse
    {
        try {
            $client = $this->getClient();

            DB::beginTransaction();

            $this->contactService->make(
                array_merge($request->validated(), [
                    'contactable' => $client
                ])
            );

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (Exception|Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.contact.list');
    }

    public function edit(Contact $contact): View
    {
        $client = $this->getClient();
        $roles = $this->roleService->all(false)->pluck('name', 'id');

        return view('pages.buyer.contacts.edit', compact('contact', 'client', 'roles'));
    }

    public function update(ContactRequest $request, Contact $contact): RedirectResponse
    {
        try {
            $client = $this->getClient();

            if (!$contact->contactable instanceof Client || $contact->contactable->id !== $client->id) {
                return redirect()->back()
                    ->withErrors("Este colaborador não pertence ao cliente selecionado")
                    ->withInput();
            }

            DB::beginTransaction();

            $this->contactService->update($contact, $request->validated());

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (Exception| Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.contact.list');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Contact $contact): RedirectResponse
    {
        $client = $this->getClient();
        if (!$contact->contactable instanceof Client || $contact->contactable->id !== $client->id) {
            return redirect()->back()
                ->withErrors("Este colaborador não pertence ao cliente selecionado")
                ->withInput();
        }

        $contact->delete();

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
