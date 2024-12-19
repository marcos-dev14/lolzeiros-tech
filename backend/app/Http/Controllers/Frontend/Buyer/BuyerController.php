<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\ClientPdv;
use App\Rules\CNPJ;
use App\Services\ApiDocumentResponseService;
use App\Services\ClientSessionManager;
use App\Services\CountryCityService;
use App\Services\CountryStateService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Throwable;

class BuyerController extends Controller
{
    public function __construct(
        private ClientSessionManager $_sessionManager,
        protected CountryStateService $countryStateService,
        protected CountryCityService $cityService,
        private ApiDocumentResponseService $_apiDocumentResponseService
    ) {}

    public function clients(): View
    {
        $selectedClient = $this->_sessionManager->getSessionSelectedClient();
        $allClients = $this->_sessionManager->getSessionAllClients();

        return view('pages.buyer.clients', compact('selectedClient', 'allClients'));
    }

    public function showNewClientForm(): View
    {
        $pdvs = ClientPdv::pluck('name', 'id');

        return view('pages.buyer.new-client', compact('pdvs'));
    }

    /**
     * @throws Throwable
     */
    public function storeClient(Request $request): RedirectResponse
    {
        $clientData = $request->only('client_pdv_id', 'document', 'name');

        $validator = Validator::make($clientData, [
            'client_pdv_id' => 'nullable|integer|exists:client_pdvs,id',
            'name' => 'required|string',
            'document' => [
                'required',
                Rule::unique('clients', 'document'),
                new CNPJ
            ],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->with('errorForm', $validator->errors()->getMessages())
                ->withInput();
        }

        DB::beginTransaction();

        try {
            $buyer = $this->_sessionManager->getBuyer();

            $apiDocumentData = $this->_apiDocumentResponseService->setData(
                $clientData['document'],
                $request->receita_api
            );
            $apiDocumentData = $apiDocumentData->response;

            $clientData = array_merge($clientData, [
                'client_profile_id' => $buyer->clients?->first()?->client_profile_id ?? 1,
                'client_origin_id' => 52,
                'seller_id' => 13,
                'client_group_id' => $buyer->group?->id
            ]);

            $clientData = $this->_apiDocumentResponseService->supplyArray(
                $apiDocumentData,
                $clientData,
                [
                    'activity_list',
                    'legal_representative_list',
                    'joint_stock',
                    'company_name',
                    'name',
                    'document_status',
                    'auge_register',
                    'activity_start'
                ]
            );

            $isInactive = $clientData['document_status'] !== 'Ativa';
            $clientData['seller_id'] = 13; // Inativo
            if ($isInactive) {
                $clientData['seller_id'] = 14; // Inativo
                $clientData['commercial_status'] = 'Inativo';
            }

            $clientAddressData = $this->_apiDocumentResponseService->getAddressData($apiDocumentData);

            $client = new Client($clientData);
            $address = new Address($clientAddressData);

            $client->save();
            $client->addresses()->save($address);

            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors($exception->getMessage())
                ->withInput();
        }

        $this->_sessionManager->setSessionClient();

        return redirect()->route('buyer.clients');
    }
}
