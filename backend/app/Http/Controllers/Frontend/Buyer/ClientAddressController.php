<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\AddressRequest;
use App\Models\Address;
use App\Models\AddressType;
use App\Models\Client;
use App\Models\CountryState;
use App\Services\AddressService;
use App\Services\ClientSessionManager;
use App\Services\CountryStateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class ClientAddressController extends Controller
{
    public function __construct(
        protected ClientSessionManager $sessionManager,
        protected AddressService       $addressService,
        protected CountryStateService  $stateService,
    ) {}

    protected function getClient(): ?Client
    {
        return $this->sessionManager->getSessionSelectedClient();
    }

    public function index(): View
    {
        $client = $this->getClient();

        return view('pages.buyer.addresses.index', compact('client'));
    }

    public function create(): View
    {
        $client = $this->getClient();

        $addressTypes = AddressType::query();
        if ($client->mainAddress) {
            $addressTypes->where('id', '!=', 1);
        }
        $addressTypes = $addressTypes->pluck('name', 'id');
        $countryStates = CountryState::pluck('code', 'code');

        return view('pages.buyer.addresses.create', compact(
            'client',
            'addressTypes',
            'countryStates'
        ));
    }

    public function store(AddressRequest $request): RedirectResponse
    {
        try {
            $client = $this->getClient();

            DB::beginTransaction();

            $this->addressService->make(
                array_merge($request->validated(), [
                    'addressable' => $client
                ])
            );

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (\Exception| Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.address.list');
    }

    public function edit(Address $address): View
    {
        $client = $this->getClient();

        $addressTypes = AddressType::query();
        if ($client->mainAddress) {
            $addressTypes->where('id', '!=', 1);
        }
        $addressTypes = $addressTypes->pluck('name', 'id');
        $countryStates = $this->stateService->all(false)->sortBy('code')->pluck('code', 'code');
        $address->load('state', 'city');

        return view('pages.buyer.addresses.edit', compact(
            'address',
            'client',
            'addressTypes',
            'countryStates'
        ));
    }

    public function getAddress(Address $address): JsonResponse
    {
        $address->load('state', 'type');

        return response()->json($address);
    }

    public function update(AddressRequest $request, Address $address): RedirectResponse
    {
        try {
            $client = $this->getClient();

            if (!$address->addressable instanceof Client || $address->addressable->id !== $client->id) {
                return redirect()->back()
                    ->withErrors("Este endereço não pertence ao cliente selecionado")
                    ->withInput();
            }

            DB::beginTransaction();

            $this->addressService->update($address, $request->validated());

            DB::commit();

            $this->sessionManager->setSessionClient();
        } catch (\Exception| Throwable $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        return redirect()->route('buyer.address.list');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Address $address): RedirectResponse
    {
        $client = $this->getClient();

        if (!$address->addressable instanceof Client || $address->addressable->id !== $client->id) {
            return redirect()->back()
                ->withErrors("Este endereço não pertence ao cliente selecionado")
                ->withInput();
        }

        $address->delete();

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
