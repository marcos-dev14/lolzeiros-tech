<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Client\AuthRequest;
use App\Models\Address;
use App\Models\Buyer;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\ClientPdv;
use App\Models\CountryCity;
use App\Models\CountryState;
use App\Models\User;
use App\Rules\CNPJ;
use App\Services\ApiDocumentResponseService;
use App\Services\CartService;
use App\Services\ClientSessionManager;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

class AuthController extends Controller
{
    private string $guard = 'buyer';

    public function __construct(
        private ClientSessionManager $_sessionManager,
        private CartService $_cartService,
        private ApiDocumentResponseService $_apiDocumentResponseService
    ) {
    }

    public function showLoginForm(): View|RedirectResponse
    {
        if (auth()->guard($this->guard)->user()) {
            return redirect()->route('buyer.clients');
        }

        $clientPdvs = ClientPdv::orderBy('name')->pluck('name', 'id');

        return view('pages.register', compact('clientPdvs'));
    }

    public function login(AuthRequest $request): RedirectResponse
    {
        $credentials = $request->validated();

        if (
            !auth()->guard($this->guard)->attempt(
                ['email' => $credentials['email'], 'password' => $credentials['password']],
                $credentials['remember']
            )
        ) {
            return back()->with('error', 'Os dados informados estão incorretos.');
        }

        $request->session()->regenerate();

        try {
            $this->_sessionManager->setSessionClient();
            $this->_cartService->setSessionCart(session()->get('buyer.clients.selected'));

        } catch (Throwable $exception) {
            $this->killSession($request);

            return back()->with('error', $exception->getMessage());
        }
        $buyerId = auth()->guard($this->guard)->user()->id;
        $buyer = Buyer::find($buyerId);

        if ($buyer) {
            $buyer->last_login = Carbon::today();

            $buyer->save();
        }

        return redirect()->intended(route('buyer.clients'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->killSession($request);

        return redirect()->route('index');
    }

    public function register(Request $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $clientData = $request->client;
            $buyerData = $request->buyer;
            $captchaData = $request->only('captcha');

            $intendedDocument = $clientData['document'];
            if (Client::where('document', $intendedDocument)->count()) {
                DB::rollBack();

                Log::info("Tentativa de cadastro de empresa já registrada, pelo site. CNPJ $intendedDocument");

                Session::flash(
                    'message',
                    "A sua empresa já está registrada.<br> Não sabe os dados de acesso? <a href='https://api.whatsapp.com/send?phone=55" . onlyNumbers(config('square_config.whatsapp')) . "' title='Falar no whatsapp' target='_blank'>Clique aqui e fale com nosso suporte no Whatsapp.</a>"
                );

                return back()->withInput($request->all());
            }

            $apiDocumentData = $this->_apiDocumentResponseService->setData(
                $clientData['document'],
                $request->receita_api
            );
            $apiDocumentData = $apiDocumentData->response;

            $clientData = $this->_apiDocumentResponseService->supplyArray(
                $apiDocumentData,
                $clientData,
                [
                    'activity_list',
                    'legal_representative_list',
                    'joint_stock',
                    'company_name',
                    //'name',
                    'document_status',
                    'auge_register',
                    'activity_start'
                ]
            );

            $clientData['client_profile_id'] = 1;
            $clientData['client_origin_id'] = 52;
            $clientData['client_name'] = ucwords(Str::lower(
                !empty($apiDocumentData->fantasia)
                ? $apiDocumentData->fantasia : $apiDocumentData->nome
            )
            ) ?? null;

            $isInactive = $clientData['document_status'] !== 'Ativa';
            $clientData['seller_id'] = 13; // Inativo
            if ($isInactive) {
                $clientData['seller_id'] = 14; // Inativo
                $clientData['commercial_status'] = 'Inativo';
            }

            $validator = Validator::make(array_merge($clientData, $buyerData, $captchaData), [
                'client_name' => 'string|required',
                'document' => [
                    'required',
                    Rule::unique('clients', 'document'),
                    new CNPJ
                ],
                'name' => 'required|string',
                'client_pdv_id' => 'nullable|exists:client_pdvs,id,deleted_at,NULL',
                'cellphone' => 'required|string',
                'email' => 'required|email|unique:buyers',
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(6)
                ],
            ]);

            if ($validator->fails()) {
                return redirect()->back()
                    ->with('errorForm', $validator->errors()->getMessages())
                    ->withInput();
            }

            unset($buyerData['password_confirmation']);
            //$buyerData['password'] = bcrypt($buyerData['password']);
            $buyerData['active'] = 1;

            $buyer = Buyer::firstOrCreate($buyerData);

            $groupName = explode(' ', $clientData['client_name'])[0];
            $groupName .= '-' . rand(1111, 9999);

            $group = ClientGroup::firstOrCreate([
                'name' => $groupName,
                'buyer_id' => $buyer->id
            ]);

            $clientData['client_group_id'] = $group->id;
            $clientData['name'] = $clientData['client_name'];
            unset($clientData['client_name']);

            $client = Client::firstOrCreate($clientData);

            $clientAddressData = $this->_apiDocumentResponseService->getAddressData($apiDocumentData);
            $countryState = CountryState::where('code', $clientAddressData['country_state_id'])->first();
            $clientAddressData['address_type_id'] = 1;

            if ($countryState) {
                $clientAddressData['country_state_id'] = $countryState->id;

                $countryCity = CountryCity::where('country_state_id', $countryState->id)
                    ->where('name', 'like', "%{$clientAddressData['country_city_id']}%")->first();
                $clientAddressData['country_city_id'] = $countryCity?->id;
            }

            $address = new Address($clientAddressData);
            $client->addresses()->save($address);

            DB::commit();

            auth()->guard($this->guard)->login($buyer);

            $this->_sessionManager->setSessionClient();

            return redirect()->route('buyer.company');
        } catch (Throwable | Exception $exception) {
            DB::rollBack();

            return back()
                ->with('error', $exception->getMessage())
                ->withInput($request->all());
        }
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
        $sellerToken = $request->input('token');
        $clientId = $request->input('client_id');

        $seller = User::where('email', $sellerEmail)->first();

        if (!$this->validateSellerToken($seller, $sellerToken)) {
            return redirect()->route('buyer.showLoginForm')->with('error', 'Token de comercial inválido');
        }

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
            $this->_sessionManager->loginUsingId($buyer->id);
            $this->_sessionManager->setSessionClient($client->id);
            $this->_cartService->setSessionCart(session()->get('buyer.clients.selected'));
        } catch (Throwable $exception) {
            $this->killSession($request);

            return redirect()->route('buyer.showLoginForm')->with('error', $exception->getMessage());
        }

        return redirect()->route('index');
    }

    protected function validateSellerToken(User $seller, string $sellerToken): bool
    {
        $foundToken = PersonalAccessToken::findToken($sellerToken);

        return $foundToken && $foundToken->tokenable->id === $seller->id;
    }
}
