<?php

namespace App\Console\Commands;

use App\Models\Address;
use App\Models\ApiDocumentResponse;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\SaleChannel;
use App\Models\Seller;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use App\Services\AddressService;
use App\Services\ApiDocumentResponseService;
use App\Services\ClientService;
use App\Services\ContactService;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use JetBrains\PhpStorm\NoReturn;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Throwable;

class ImportOrders extends Command
{
    protected $signature = 'import:orders';

    protected $description = 'Import orders';

    public function __construct(
        protected ClientService $entityService,
        protected AddressService $addressService,
        protected ContactService $contactService,
        protected ApiDocumentResponseService $apiDocumentResponseService
    ) {
        parent::__construct();
    }

    protected function importDataFromFile(string $filePath, array $columns)
    {
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rowLimit = $sheet->getHighestDataRow();
        $rowRange = range(2, $rowLimit);

        $data = [];

        try {
            foreach ($rowRange as $row) {
                $emptyFields = 0;

                foreach ($columns as $column) {
                    $cell = $sheet->getCell("$column->column$row");
                    $calculatedValue = $cell->getCalculatedValue();
                    $type = gettype($calculatedValue);
                    $calculatedValue = trim(preg_replace('/\s+/', ' ', $calculatedValue));
                    settype($calculatedValue, $type);

                    $temp[$column->field_name] = $calculatedValue;

                    if (empty($temp[$column->field_name]) && $temp[$column->field_name] !== 0) {
                        $emptyFields++;
                    }
                }

                if ($emptyFields < count($columns)) {
                    array_push($data, $temp);
                }
            }

            if ($emptyFields < count($columns)) {
                array_push($data, $temp);
            }
        } catch (Exception $exception) {
            return dd($exception->getMessage(), $exception->getLine());
        }

        return $data;
    }

    protected function importOrders()
    {
        $this->info('Importar Vendas!');
        $arrayData = $this->importDataFromFile(public_path('import/orders.xlsx'), [
            (object) ['column' => 'A', 'field_name' => 'installment_rule_value'],
            (object) ['column' => 'B', 'field_name' => 'profile_discount'],
            (object) ['column' => 'C', 'field_name' => 'current_status'],
            (object) ['column' => 'D', 'field_name' => 'shipping_company'],
            (object) ['column' => 'E', 'field_name' => 'total_value'],
            (object) ['column' => 'F', 'field_name' => 'client'],
            (object) ['column' => 'G', 'field_name' => 'product_supplier'],
            (object) ['column' => 'H', 'field_name' => 'seller'],
            (object) ['column' => 'I', 'field_name' => 'sale_channel'],
            (object) ['column' => 'J', 'field_name' => 'old_id'],
            (object) ['column' => 'K', 'field_name' => 'created_at'],
            (object) ['column' => 'L', 'field_name' => 'order_type']
        ]);

        $cacheKey = 'IMPORT_ORDERS_DATA';
        //Cache::forget($cacheKey);
        $notImportedDocuments = [];
        //$arrayData = Cache::remember($cacheKey, now()->addMinutes(60 * 24), function () use ($arrayData) {
            $this->line('Formatar dados');
            $bar = $this->output->createProgressBar(count($arrayData));

            $newArrayData = [];

            foreach ($arrayData as $line => $item) {
                $client = $this->getClient($item['client']);

                if ($client instanceof Client) {
                    $hasApiResponse = ApiDocumentResponse::where('document', onlyNumbers($client->document))->count();
                    if (!$hasApiResponse) {
                        array_push($notImportedDocuments, $item['client']);
                        $this->line("\nCliente ainda não validado CNPJ: $client->document | Contagem em " . count($notImportedDocuments));
                        dd($client);
                        $bar->advance();
                        continue;
                    }
                }

                $clientAddress = $client instanceof Client ? $client->getMainAddress() : null;
                $supplier = $this->getSupplier($item['product_supplier']);
                $seller = $this->getSeller($item['seller']);
                $saleChannel = $this->getSaleChannel($item['sale_channel']);
                $buyer = $client?->buyer;
                $shippingCompany = $this->getShippingCompanyId($item['shipping_company']);
                $shippingCompanyName = $shippingCompany?->name ?? ucwords(trim(mb_strtolower($item['shipping_company'])));
                if ($shippingCompanyName == '0') $shippingCompanyName = null;

                if (!empty($item['created_at'])) {
                    $value = intval($item['created_at']);
                    $unixDate = ($value - 25569) * 86400;
                    $item['created_at'] = Carbon::parse($unixDate)->format('Y-m-d H:i:s');
                }

                $temp = [
                    'old_id' => ltrim($item['old_id']) ?? null,
                    'origin' => 'Importação',
                    'installment_rule_value' => $item['installment_rule_value'] ?? 0.00,
                    'fractional_box' => 0,
                    'profile_discount' => $item['profile_discount'] ?? 0.00,
                    'shipping_company_id' => $shippingCompany?->id,
                    'shipping_company_name' => $shippingCompanyName,
                    'total_value' => $item['total_value'] ?? 0.00,
                    'total_value_with_ipi' => $item['total_value'] ?? 0.00,
                    'total_discount' => 0.00,
                    'client_id' => $client?->id,
                    'address_street' => $clientAddress?->street,
                    'address_number' => $clientAddress?->number,
                    'address_complement' => $clientAddress?->complement,
                    'address_district' => $clientAddress?->district,
                    'address_zipcode' => $clientAddress?->zipcode,
                    'address_city' => $clientAddress?->city?->name,
                    'country_city_id' => $clientAddress?->city?->id,
                    'country_state_id' => $clientAddress?->state?->id,
                    'address_state' => $clientAddress?->state?->name,
                    'product_supplier_id' => $supplier?->id,
                    'product_supplier_name' => $supplier?->name ?? ucwords(trim(mb_strtolower($item['product_supplier']))),
                    'seller_id' => $seller?->id,
                    'sale_channel_id' => $saleChannel?->id,
                    'order_type_id' => 1,
                    'buyer_id' => $buyer?->id,
                    'buyer_name' => $buyer?->name,
                    'buyer_email' => $buyer?->email,
                    'buyer_cellphone' => $buyer?->cellphone,
                    'current_status' => $item['current_status'],
                    'created_at' => $item['created_at']
                ];

                $newArrayData[$line] = $temp;

                $bar->advance();
            }

            //return $newArrayData;
            $arrayData = $newArrayData;
        //});

        $this->line("\n\nImportar dados das vendas");
        $bar = $this->output->createProgressBar(count($arrayData));

        foreach ($arrayData as $key => $item) {
            $order = Order::where('old_id', $item['old_id'])->where('client_id', $item['client_id'])->first();
            $currentStatus = ucfirst(strtolower($item['current_status']));
            $item['client_last_order'] = $this->getClientLastOrder($item['old_id'], $item['client_id']);
            unset($item['current_status']);

            if (!$order instanceof Order) {
                $order = Order::create($item);
                $availableStatuses = (new OrderStatus)->statuses;

                if (!empty($currentStatus) && in_array($currentStatus, $availableStatuses)) {
                    $currentStatus = array_search($currentStatus, $availableStatuses);
                    OrderStatus::create([
                        'name' => $currentStatus,
                        'order_id' => $order->id
                    ]);
                }
            } else {
                unset($item['client_last_order']);
                $order->update($item);
            }

            $bar->advance();
        }

        dd('Não importados: ', $notImportedDocuments);
    }

    #[NoReturn]
    public function handle()
    {
        $this->info("Importação iniciada...");

        $this->importOrders();

        $this->info("\n\nImportação finalizada!!!");
    }

    protected function getClient($input): Builder|Client|null
    {
        return Client::with('addresses', 'group.buyer', 'orders')
            ->where('old_id', $input)->orWhere('old_id', ltrim($input, "0"))
            ->first();
    }

    public function getSupplier($input)
    {
        if (is_int($input)) {
            return Supplier::find($input);
        } else {
            $supplier = Supplier::where('name', $input)->first();

            if ($supplier instanceof Supplier) {
                return $supplier;
            }

            return null;
            dd('Fornecedor não encontrado: ', $input);
        }
    }

    public function getSeller($input)
    {
        if (is_int($input)) {
            return Seller::find($input);
        } else {
            if (str_contains($input, '&')) {
                return Seller::find(1);
            }

            return null;
            dd('vendedor não encontrado: ', $input);
        }
    }

    protected function getSaleChannel($input): ?SaleChannel
    {
        return (is_int($input))
            ? SaleChannel::find($input)
            : SaleChannel::updateOrCreate(['name' => ucwords(trim(mb_strtolower($input)))]);
    }

    protected function getShippingCompanyId($input)
    {
        if (is_int($input)) {
            return ShippingCompany::find($input);
        } else {
            $shippingCompany = ShippingCompany::where('name', $input)->first();

            if ($shippingCompany instanceof ShippingCompany) {
                return $shippingCompany;
            }

            return null;
            dd('Transportadora não encontrada: ', $input);
        }
    }

    protected function getClientLastOrder(int|string $orderOldId, $client)
    {
        if (is_int($client)) {
            $client = Client::find($client);
        }

        if (!$client instanceof Client) {
            return null;
        }

        return $client->orders()
            ->where('old_id', '!=', $orderOldId)
            ->get()
            ->last()
            ?->created_at;
    }

    /**
     * @throws Throwable
     */
    protected function updateClientData(Client $client)
    {
        try {
            $apiDocumentData = $this->apiDocumentResponseService->getData($client->document, true);

            $apiDocumentDataResponse = $apiDocumentData->response;
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
            //dd($e->getMessage());
            $this->line('');
            $this->error("Exception updating data for client with CNPJ $client->document: {$e->getMessage()}");
            $this->line('');
            //sleep(60);
        }
    }
}
