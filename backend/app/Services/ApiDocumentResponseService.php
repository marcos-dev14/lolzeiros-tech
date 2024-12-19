<?php

namespace App\Services;

use App\Models\ApiDocumentResponse;
use App\Models\CountryState;
use App\Services\Utils\QueryCriteria;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class ApiDocumentResponseService
{
    public function __construct(
        protected CountryStateService $countryStateService,
        protected CountryCityService $cityService,
        protected TaxRegimeService $taxRegimeService,
    ) {}

    protected function storedDataIsTooOld(?ApiDocumentResponse $storedData): bool
    {
        if ($storedData === null) {
            return true;
        }

        return $storedData->updated_at?->lt(now()->addDays(-30));
    }

    public function getData(string $document, bool $newSearch = false): ApiDocumentResponse
    {
        $document = onlyNumbers($document);

        $storedData = ApiDocumentResponse::where('document', $document)->first();

        if ($storedData && $storedData->updated_at->gt(now()->addDays(-7))) {
            $newSearch = false;
        }
        if ($newSearch || !$storedData || $this->storedDataIsTooOld($storedData)) {
            Cache::forget("API_DOCUMENT_RESPONSE_$document");
            $rawData = $this->getRawData($document);

            $data = [
                'document' => $document,
                'response' => serialize(json_decode($rawData)),
            ];

            if (!$storedData) {
                return ApiDocumentResponse::create($data);
            }

            $storedData->update($data);
        }

        return $storedData;
    }

    protected function getRawData(string $document)
    {
        return Cache::rememberForever("API_DOCUMENT_RESPONSE_$document", function () use ($document) {
            try {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
                curl_setopt($ch, CURLOPT_URL, "https://www.receitaws.com.br/v1/cnpj/$document");
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

                return curl_exec($ch);
            } catch (Exception $e) {
                if ($e->getMessage() == "file_get_contents(https://www.receitaws.com.br/v1/cnpj/$document): Failed to open stream: HTTP request failed! HTTP/1.1 404 Not Found\r\n") {
                    return '{"status": "ERROR", "message": "not in cache"}';
                } elseif ($e->getMessage() != "file_get_contents(https://www.receitaws.com.br/v1/cnpj/$document): Failed to open stream: HTTP request failed! HTTP/1.1 429 Too Many Requests\r\n") {
                    dd($e->getMessage(), $e->getCode());
                } else {
                    throw new Exception($e->getMessage(), $e->getCode());
                }
            }
        });
    }

    public function setData(string $document, $data): ApiDocumentResponse
    {
        $register = ApiDocumentResponse::where('document', $document)->first();

        Cache::rememberForever("API_DOCUMENT_RESPONSE_$document", fn () => $data);

        if ($register) {
            $register->update([
                'response' => serialize(json_decode($data)),
            ]);
        } else {
            $register = ApiDocumentResponse::create([
                'document' => $document,
                'response' => serialize(json_decode($data)),
            ]);
        }

        return $register;
    }

    public function getActivityList($apiDocumentData): null|string
    {
        $mainActivity = $apiDocumentData?->atividade_principal;
        $otherActivities = $apiDocumentData?->atividades_secundarias;
        $activityList = '';

        if (!empty($mainActivity)) {
            $activityList .= "Atividade Principal\n";

            foreach ($mainActivity as $item) {
                $activityList .= "$item->code: $item->text\n";
            }
        }

        if (!empty($otherActivities)) {
            $activityList .= "\nAtividades Secundárias\n";

            foreach ($otherActivities as $item) {
                $activityList .= "$item->code: $item->text\n";
            }
        }

        return !empty($activityList) ? $activityList : null;
    }

    public function getLegalRepresentativeList($apiDocumentData): null|string
    {
        $legalRepresentatives = $apiDocumentData->qsa;
        $legalRepresentativeList = '';

        if (!empty($legalRepresentatives)) {
            $legalRepresentativeList .= "Representantes Legais:\n";

            foreach ($legalRepresentatives as $item) {
                $legalRepresentativeList .= "$item->qual: $item->nome\n";
            }
        }

        return !empty($legalRepresentativeList) ? $legalRepresentativeList : null;
    }

    /**
     * @throws Throwable
     */
    public function supplyArray(object $documentData, array $target, array $keys): array
    {
        $availableKeys = [
            'activity_list',
            'legal_representative_list',
            'company_name',
            'name',
            'document_status',
            'auge_register',
            'activity_start',
            'joint_stock',
            'tax_regime_id',
            'address',
            'contact'
        ];
        foreach ($keys as $key) {
            if (!in_array($key, $availableKeys)) {
                continue;
            }

            $target[$key] = match ($key) {
                'activity_list' => $this->getActivityList($documentData),
                'legal_representative_list' => $this->getLegalRepresentativeList($documentData),
                'company_name' => ucwords(mb_strtolower($documentData->nome)) ?? null,
                'name' => ucwords(mb_strtolower($documentData->fantasia)) ?? null,
                'document_status' => Str::ucfirst(mb_strtolower($documentData->situacao)),
                'auge_register' => Carbon::now(),
                'activity_start' => !empty($documentData->abertura)
                    ? Carbon::createFromFormat('d/m/Y', $documentData->abertura)
                    : null,
                'joint_stock' => !empty($documentData->capital_social)
                    ? 'R$ ' . formatMoney(value: $documentData->capital_social, thousandSeparator: '')
                    : null,
                'tax_regime_id' => $this->getTaxRegimeId($documentData),
                'address' => $this->getAddressData($documentData),
                'contact' => $this->getContact($documentData),
            };
        }

        return $target;
    }

    #[ArrayShape([
        'zipcode' => 'null|string',
        'street' => 'null|string',
        'number' => 'mixed',
        'complement' => 'mixed',
        'district' => 'null|string',
        'country_state_id' => 'null|string',
        'country_city_id' => 'null|string',
        'address_type_id' => 'int',
    ])]
    public function getAddressData(object $documentData): array
    {
        $stateCode = $documentData->uf ?? null;
        $cityName = $documentData->municipio ?? null;
        $state = null;
        $city = null;

        if ($stateCode) {
            try {
                $state = $this->countryStateService->getBy($stateCode, 'code');
            } catch (Throwable $e) {
                $state = null;
            }

            if ($state instanceof CountryState) {
                $this->cityService->criteria = new QueryCriteria('country_state_id', $state->id);

                try {
                    $city = $this->cityService->getBy($cityName, 'name');
                } catch (Throwable $e) {
                    $city = null;
                }
            }
        }

        return [
            'zipcode' => $documentData->cep ?? null,
            'street' => ucwords(mb_strtolower($documentData->logradouro)) ?? null,
            'number' => $documentData->numero ?? null,
            'complement' => $documentData->complemento ?? null,
            'district' => ucwords(mb_strtolower($documentData->bairro)) ?? null,
            'country_state_id' => $state?->id,
            'country_city_id' => $city?->id,
            'address_type_id' => 1,
        ];
    }

    #[ArrayShape([
        'email' => 'string|null',
        'phone' => 'string|null',
        'role_id' => 'integer',
    ])]
    public function getContact(object $documentData): array
    {
        return [
            'email' => $documentData?->email,
            'phone' => $documentData?->telefone,
            'role_id' => 17
        ];
    }

    /**
     * @throws Throwable
     */
    public function getTaxRegimeId(object $documentData): ?int
    {
        $porte = $documentData->porte ?? null;

        if (!$porte) {
            return $porte;
        }

        try {
            $taxRegime = $this->taxRegimeService->getBy($porte, 'name', 'like');
        } catch (Exception $e) {
            return null;
        }

        return $taxRegime->id;
    }
}
