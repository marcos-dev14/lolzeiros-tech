<?php

namespace App\Console\Commands;

use App\Models\Address;
use App\Models\ApiDocumentResponse;
use App\Models\Client;
use App\Services\AddressService;
use App\Services\ApiDocumentResponseService;
use App\Services\ClientService;
use App\Services\ContactService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UpdateDataClients extends Command
{
    protected $signature = 'update:clients';

    protected $description = 'Update clients data from API Receita';

    public function __construct(
        protected ClientService $entityService,
        protected AddressService $addressService,
        protected ContactService $contactService,
        protected ApiDocumentResponseService $apiDocumentResponseService
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Revalidar Clientes!');

        $storedApiResponses = ApiDocumentResponse::select('document')->pluck('document');
        $storedApiResponses = $storedApiResponses->map(function ($document) {
            return $this->formatDocument($document);
        });
        $countClients = Client::where('validated', 0)
            //->whereIn('document', $storedApiResponses)
            //->whereNotIn('document', $storedApiResponses)
            ->get()
            ->count();

        $bar = $this->output->createProgressBar($countClients);

        do {
            $clients = $this->getClients($storedApiResponses);

            foreach ($clients as $client) {
                try {
                    //$this->info("Updating data for client with CNPJ $client->document");

                    $apiDocumentData = $this->apiDocumentResponseService->getData($client->document, true);

                    $apiDocumentDataResponse = $apiDocumentData->response;

                    if (isset($apiDocumentDataResponse->status) && $apiDocumentDataResponse->status == 'ERROR') {
                        $this->error("\nCNPJ inválido | cliente ID $client->id e CNPJ $client->document");
                        $client->update([
                            'validated' => 2,
                            'document_status' => 'CNPJ Inválido'
                        ]);
                        $bar->advance();
                        continue;
                    }

                    if (is_null($apiDocumentDataResponse)) {
                        dd($apiDocumentDataResponse, $client->document);
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
                    unset($clientData['address'], $clientData['contact']);
                } catch (\Throwable|\Exception $e) {
                    $this->line('');
                    $this->error("Exception updating data for client with CNPJ $client->document: {$e->getMessage()} | file: {$e->getFile()} | line {$e->getLine()}");
                    sleep(60);
                    continue;
                }

                try {
                    DB::beginTransaction();

                    $this->entityService->revalidateWithExternalApiData($client, $clientData);

                    if (!empty($addressData)) {
                        $client->load('addresses');
                        $storedAddress = $client->addresses()->where('address_type_id', 1)->first();

                        if (!$storedAddress) {
                            $addressData += [
                                'addressable_type' => $client::class,
                                'addressable_id' => $client->id
                            ];
                            $newAddress = new Address();
                            $newAddress->fill($addressData);
                            $client->addresses()->save($newAddress);
                        } else {
                            $this->addressService->update($storedAddress->id, $addressData);
                        }
                    } else {
                        dd('data vazio', $addressData);
                    }

                    if (!empty($contactData['email']) || !empty($contactData['phone'])) {
                        $client->load('contacts');
                        $storedContact = $client->getApiContact();

                        if (!$storedContact) {
                            $newContact = $this->contactService->make(
                                array_merge($contactData, [
                                    'name' => 'Api Receita',
                                    'contactable' => $client
                                ])
                            );
                        } else {
                            $this->contactService->update($storedContact->id, $contactData);
                        }
                    }
                } catch (\Throwable|\Exception $e) {
                    DB::rollBack();

                    $this->line('');
                    $this->error("\nException updating data for client with CNPJ $client->document: {$e->getMessage()} | file: {$e->getFile()} | line {$e->getLine()}");
                    //sleep(60);
                    continue;
                }

                DB::commit();

                $client->update(['validated' => 1]);

                $bar->advance();
            }
        } while (count($clients));

        $this->info('Finalizado');
    }

    public function getClients(Collection $storedApiResponses): \Illuminate\Database\Eloquent\Collection|array
    {
        // Busca os clientes com validated = 0 do banco de dados com limite e deslocamento
        return Client::where('validated', 0)
            //->whereIn('document', $storedApiResponses)
            //->whereNotIn('document', $storedApiResponses)
            //query()
            ->limit(3)
            ->get();
    }

    protected function formatDocument(string $document): string
    {
        $document = preg_replace("/[^0-9]/", "", $document);

        return sprintf(
            "%s.%s.%s/%s-%s",
            substr($document, 0, 2),
            substr($document, 2, 3),
            substr($document, 5, 3),
            substr($document, 8, 4),
            substr($document, 12, 2)
        );
    }
}
