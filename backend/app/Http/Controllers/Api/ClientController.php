<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ClientListRequest;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\AddressService;
use App\Services\ApiDocumentResponseService;
use App\Services\ClientService;
use App\Services\ContactService;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use JetBrains\PhpStorm\NoReturn;
use Throwable;

class ClientController extends BaseController
{
    #[NoReturn]
    public function __construct(
        protected ClientService $entityService,
        protected AddressService $addressService,
        protected ContactService $contactService,
        protected ApiDocumentResponseService $apiDocumentResponseService
    ) {}

    public function index(ClientListRequest $request): JsonResponse
    {
        try {
            $this->entityService->enableFilters(
                $request->validated()
            );
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        $this->entityService->relations = [
            'group',
            'seller',
            'profile',
            'addresses.state',
            'addresses.state',
            'orders',
            'cart.instances'
        ];
        $items = $this->entityService->all($request->paginated, $request->per_page);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                ClientResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(ClientResource::collection($items), Lang::get('custom.found_registers'));
    }

    public function show($id): JsonResponse
    {
        try {
            $item = $this->entityService->show($id);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new ClientResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function store(ClientRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $validatedData = $request->validated();
            $addressData = $validatedData['address'];
            $contactData = $validatedData['contact'];
            unset($validatedData['address'], $validatedData['contact']);

            $client = $this->entityService->make($request->validated());

            if (!empty($addressData)) {
                $this->addressService->make(
                    array_merge($addressData, [
                        'addressable' => $client
                    ])
                );
            }

            if (!empty($contactData)) {
                $this->contactService->make(
                    array_merge($contactData, [
                        'name' => 'Api Receita',
                        'contactable' => $client
                    ])
                );
            }

            $client = $this->entityService->show($client->id);
        } catch (Throwable $e) {
            DB::rollBack();

            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        DB::commit();

        return $this->sendResponse(new ClientResource($client), Lang::get('custom.register_added'), 201);
    }

    public function update(ClientRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->show($itemId);
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(new ClientResource($item), Lang::get('custom.register_updated'));
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroy($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }

    public function updateFromExternalApi(Client $client): JsonResponse
    {
        try {
            DB::beginTransaction();

            $apiDocumentData = $this->apiDocumentResponseService->getData($client->document, true);
            $apiDocumentDataResponse = $apiDocumentData->response;

            $inactiveSellerId = 14;
            $inactiveCommercialStatus = 'Inativo';
            if (isset($apiDocumentDataResponse->message) && $apiDocumentDataResponse->message = 'CNPJ inválido') {
                $client->update([
                    'document_status' => 'CNPJ Inválido',
                    'seller_id' => $inactiveSellerId,
                    'commercial_status' => $inactiveCommercialStatus
                ]);

                DB::commit();

                return $this->sendError(
                    "O CNPJ deste cliente é inválido segundo API da Receita Federal",
                    [],
                    400
                );
            }

            $clientData = $this->apiDocumentResponseService->supplyArray($apiDocumentDataResponse, [], [
                'activity_list',
                'legal_representative_list',
                'joint_stock',
                'company_name',
                'name',
                'document_status',
                'activity_start',
                'tax_regime_id',
                'address',
                'contact',
            ]);

            $addressData = $clientData['address'];
            $contactData = $clientData['contact'];

            $isInactive = $clientData['document_status'] !== 'Ativa';
            if ($isInactive) {
                $clientData['seller_id'] = $inactiveSellerId; // Inativo
                $clientData['commercial_status'] = $inactiveCommercialStatus;
            }

            unset($clientData['address'], $clientData['contact']);

            $this->entityService->revalidateWithExternalApiData($client, $clientData);

            if (!empty($addressData)) {
                $client->load('addresses');
                $storedAddress = $client->getMainAddress();

                if (!$storedAddress) {
                    $this->addressService->make(
                        array_merge($addressData, [
                            'addressable' => $client
                        ])
                    );
                } else {
                    $this->addressService->update($storedAddress->id, $addressData);
                }
            }

            if (!empty($contactData)) {
                $client->load('addresses');
                $storedContact = $client->getApiContact();

                if (!$storedContact) {
                    $this->contactService->make(
                        array_merge($contactData, [
                            'name' => 'Api Receita',
                            'contactable' => $client
                        ])
                    );
                } else {
                    $this->contactService->update($storedContact->id, $contactData);
                }
            }
        } catch (Throwable | Exception $e) {
            DB::rollBack();

            Log::error("{$e->getMessage()} on file {$e->getFile()} line {$e->getLine()}");

            return $this->sendError(
                "A API da Receita Federal não está disponível no momento, tente novamente em 1 minuto",
                [],
                $this->getExceptionCode($e)
            );
        }

        DB::commit();

        return $this->sendResponse([], Lang::get('custom.register_revalidated'));
    }
}
