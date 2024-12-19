<?php

namespace App\Console\Commands;

use App\Models\Buyer;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\ClientOrigin;
use App\Models\ClientPdv;
use App\Models\ClientProfile;
use App\Models\Contact;
use App\Models\Role;
use App\Models\Seller;
use App\Models\TaxRegime;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use JetBrains\PhpStorm\NoReturn;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ImportClients extends Command
{
    protected $signature = 'import:clients';

    protected $description = 'Import clients';

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

    protected function formatPhone(string $phone): string
    {
        $phone = preg_replace("/[^0-9]/", "", $phone);
        $length = strlen($phone);

        return sprintf(
        "(%s) %s-%s",
            substr($phone, 0, 2),
            substr($phone, 2, ($length === 10 ? 4 : 5)),
            substr($phone, ($length === 10 ? 6 : 7))
        );
    }

    protected function importBuyers()
    {
        $this->info("\n\nImportar Compradores!");
        $arrayData = $this->importDataFromFile(public_path('import/clients/compradores.xlsx'), [
            (object) ['column' => 'A', 'field_name' => 'name'],
            (object) ['column' => 'B', 'field_name' => 'active'],
            (object) ['column' => 'C', 'field_name' => 'cellphone'],
            (object) ['column' => 'D', 'field_name' => 'email'],
            (object) ['column' => 'E', 'field_name' => 'role_id'],
        ]);

        $bar = $this->output->createProgressBar(count($arrayData));
        foreach ($arrayData as $item) {
            $email = trim(mb_strtolower($item['email']));
            $data = [
                'cellphone' => $item['cellphone'] ? $this->formatPhone($item['cellphone']) : null,
                'name' => ucwords(trim(mb_strtolower($item['name']))),
                'password' => rand(1234567, 9876543),
                'role_id' => $item['role_id']
            ];

            Buyer::updateOrCreate([
                'email' => $email
            ], $data);

            $bar->advance();
        }
    }

    protected function importGroups()
    {
        $this->info("\n\nImportar Grupos!");
        $arrayData = $this->importDataFromFile(public_path('import/clients/grupos.xlsx'), [
            (object) ['column' => 'A', 'field_name' => 'name'],
            (object) ['column' => 'B', 'field_name' => 'email']
        ]);

        $bar = $this->output->createProgressBar(count($arrayData));
        foreach ($arrayData as $item) {
            $buyerEmail = trim(mb_strtolower($item['email']));
            unset($item['email']);

            $buyer = Buyer::where('email', $buyerEmail)->first();
            $item['buyer_id'] = $buyer?->id;

            ClientGroup::updateOrCreate([
                'name' => ucwords(trim(mb_strtolower($item['name'])))
            ], [
                'name' => ucwords(trim(mb_strtolower($item['name']))),
                'buyer_id' => $buyer?->id
            ]);

            $bar->advance();
        }
    }

    protected function importClients()
    {
        $this->info("\n\nImportar Clientes!");
        $arrayData = $this->importDataFromFile(public_path('import/clients/clientes.xlsx'), [
            (object) ['column' => 'A', 'field_name' => 'old_id'],
            (object) ['column' => 'B', 'field_name' => 'company_name'],
            (object) ['column' => 'C', 'field_name' => 'name'],
            (object) ['column' => 'D', 'field_name' => 'document'],
            (object) ['column' => 'E', 'field_name' => 'document_status'],
            (object) ['column' => 'F', 'field_name' => 'state_registration'],
            (object) ['column' => 'G', 'field_name' => 'activity_list'],
            (object) ['column' => 'H', 'field_name' => 'legal_representative'],
            (object) ['column' => 'I', 'field_name' => 'joint_stock'],
            (object) ['column' => 'J', 'field_name' => 'activity_start'],
            (object) ['column' => 'K', 'field_name' => 'auge_register'],
            (object) ['column' => 'L', 'field_name' => 'has_ecommerce'],
            (object) ['column' => 'M', 'field_name' => 'corporate_email'],
            (object) ['column' => 'N', 'field_name' => 'website'],
            (object) ['column' => 'O', 'field_name' => 'instagram'],
            (object) ['column' => 'P', 'field_name' => 'facebook'],
            (object) ['column' => 'Q', 'field_name' => 'youtube'],
            (object) ['column' => 'R', 'field_name' => 'twitter'],
            (object) ['column' => 'S', 'field_name' => 'commercial_status'],
            (object) ['column' => 'T', 'field_name' => 'group_name'],
            (object) ['column' => 'U', 'field_name' => 'profile_name'],
            (object) ['column' => 'V', 'field_name' => 'tax_regime_name'],
            (object) ['column' => 'W', 'field_name' => 'type_pdv_name'],
            (object) ['column' => 'X', 'field_name' => 'origin_name'],
            (object) ['column' => 'Y', 'field_name' => 'seller_name'],
        ]);

        $cacheKey = 'IMPORT_CLIENTS_DATA';
        Cache::forget($cacheKey);
        $arrayData = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($arrayData) {
            $this->line('Formatar dados dos clientes');
            $bar = $this->output->createProgressBar(count($arrayData));

            foreach ($arrayData as $line => $item) {
                $pascalFields = [
                    'company_name',
                    'name',
                    'status',
                    'commercial_status',
                    'tax_regime_name',
                    'type_pdv_name',
                    'origin_name',
                    'seller_name',
                    'group_name'
                ];

                $dateFields = [
                    'auge_register'
                ];

                $emailFields = [
                    'corporate_email'
                ];

                foreach ($item as $key => $value) {
                    if (in_array($key, $dateFields)) {
                        $item[$key] = Date::excelToDateTimeObject($value)->format('Y-m-d');
                        $value = $item[$key];
                    }

                    if (in_array($key, $pascalFields) || $key === 'company_name') {
                        $item[$key] = ucwords(trim(mb_strtolower($value)));
                        $value = $item[$key];
                    }

                    if (in_array($key, $emailFields)) {
                        $item[$key] = trim(mb_strtolower($value));
                        $value = $item[$key];
                    }

                    if ($key === 'document') {
                        $item[$key] = preg_replace(
                            '/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/',
                            '$1.$2.$3/$4-$5',
                            onlyNumbers($value)
                        );
                        $value = $item[$key];
                    }

                    if ($key === 'group_name') {
                        $group = ClientGroup::where('name', $value)->first();

                        if (!$group instanceof ClientGroup) {
                            $group = ClientGroup::create(['name' => $value]);
                        }

                        $item['client_group_id'] = $group->id;
                        unset($item['group_name']);
                    }

                    if ($key === 'profile_name') {
                        $profile = ClientProfile::firstOrCreate(['name' => $value]);
                        if ($profile instanceof ClientProfile) $item['client_profile_id'] = $profile->id;
                        else dd('profile não encontrado', $value);
                        unset($item['profile_name']);
                    }

                    if ($key === 'type_pdv_name') {
                        $pdv = ClientPdv::firstOrCreate(['name' => $value]);
                        $item['client_pdv_id'] = $pdv->id;
                        unset($item['type_pdv_name']);
                    }

                    if ($key === 'origin_name') {
                        $origin = ClientOrigin::where('name', $value)->get();
                        if ($origin->count() > 1)  dd($origin, 'mais de um origin encontrado');

                        $origin = $origin->first();
                        if ($origin instanceof ClientOrigin) $item['client_origin_id'] = $origin?->id;
                        else {
                            $origin = ClientOrigin::where('name', 'like', "%$value%")->first();

                            if (!$origin instanceof ClientOrigin) {
                                $origin = ClientOrigin::create([
                                    'name' => $value
                                ]);
                            }
                            $item['client_origin_id'] = $origin?->id;
                        }

                        unset($item['origin_name']);
                    }

                    if ($key === 'seller_name') {
                        $seller = Seller::where('name', $value)->get();
                        if ($seller->count() > 1)  dd($seller, 'mais de um seller encontrado');
                        if ($seller->first() instanceof Seller) {
                            $item['seller_id'] = $seller->first()->id;
                        }
                        unset($item['seller_name']);
                    }

                    if ($key === 'tax_regime_name') {
                        if (!empty($value)) {
                            $taxRegime = strtolower($value) === 'demais' ? 3 : TaxRegime::where('name', 'like', "%$value%")->get();
                            if ($taxRegime->count() > 1) dd($taxRegime->toArray(), $value, 'mais de um tax_regime encontrado');
                            if ($taxRegime) $item['client_tax_regime_id'] = $taxRegime->first()->id;
                        }
                        unset($item['tax_regime_name']);
                    }

                    $arrayData[$line] = $item;
                }

                $bar->advance();
            }

            return $arrayData;
        });

        $this->line("\n\nImportar dados dos clientes");
        $bar = $this->output->createProgressBar(count($arrayData));

        foreach ($arrayData as $line => $item) {
            Client::updateOrCreate([
                'document' => $item['document'],
                //'company_name' => $item['company_name'],
                //'name' => $item['name']
            ], $item);

            $bar->advance();
        }
    }

    protected function importClientContacts()
    {
        $this->info("\n\nImportar Contatos!");
        $arrayData = $this->importDataFromFile(public_path('import/clients/contatos.xlsx'), [
            (object) ['column' => 'A', 'field_name' => 'client_old_id'],
            (object) ['column' => 'B', 'field_name' => 'name'],
            (object) ['column' => 'C', 'field_name' => 'cellphone'],
            (object) ['column' => 'D', 'field_name' => 'phone'],
            (object) ['column' => 'E', 'field_name' => 'whatsapp'],
            (object) ['column' => 'F', 'field_name' => 'email'],
            (object) ['column' => 'G', 'field_name' => 'role_name'],
        ]);

        $cacheKey = 'IMPORT_CLIENT_CONTACTS_DATA';
        //Cache::forget($cacheKey);
        $arrayData = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($arrayData) {
            $this->line('Formatar dados dos contatos');
            $bar = $this->output->createProgressBar(count($arrayData));

            foreach ($arrayData as $line => $item) {
                $pascalFields = [
                    'name'
                ];

                $emailFields = [
                    'email'
                ];

                $phoneFields = [
                    'cellphone',
                    'whatsapp',
                    'phone'
                ];

                foreach ($item as $key => $value) {
                    if (in_array($key, $pascalFields)) {
                        $item[$key] = ucwords(trim(mb_strtolower($value)));
                        $value = $item[$key];
                    }

                    if (in_array($key, $emailFields)) {
                        $item[$key] = trim(mb_strtolower($value));
                        $value = $item[$key];
                    }

                    if (in_array($key, $phoneFields)) {
                        $item[$key] = !empty($value) ? $this->formatPhone($value) : null;
                        $value = $item[$key];
                    }

                    if ($key === 'role_name') {
                        $role = Role::where('name', $value)->get();
                        if ($role->first() instanceof Role) $item['role_id'] = $role->first()->id;
                        unset($item['role_name']);
                    }

                    $arrayData[$line] = $item;
                }

                $bar->advance();
            }

            return $arrayData;
        });

        $this->line("\n\nImportar dados dos contatos");
        $bar = $this->output->createProgressBar(count($arrayData));

        foreach ($arrayData as $item) {
            $client = Client::where('old_id', $item['client_old_id'])->first();

            if ($client instanceof Client) {
                $item['contactable_type'] = Client::class;
                $item['contactable_id'] = $client->id;
                unset($item['client_old_id']);

                Contact::updateOrCreate($item, $item);
            }

            $bar->advance();
        }
    }

    #[NoReturn]
    public function handle()
    {
        $this->info("Importação iniciada...");

        //$this->importBuyers();
        $this->importGroups();
        $this->importClients();
        //$this->importClientContacts();

        $this->info("\n\nImportação finalizada!!!");
    }
}
