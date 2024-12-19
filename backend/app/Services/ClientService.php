<?php

namespace App\Services;

use App\Models\Client;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Throwable;

class ClientService extends BaseService
{
    public function __construct()
    {
        $this->model = new Client();
    }

    public function enableFilters(array $filters): void
    {
        if (!empty($filters)) {
            $criteria = [];

            foreach ($filters as $key => $value) {
                if ($key === 'has_group') {
                    $criteria[] = new QueryCriteria(
                        'group',
                        null,
                        ($value !== 'false') ? 'hasRelation' : 'doesntHaveRelation'
                    );

                    continue;
                }

                if (str_contains($key, 'by_')) {
                    $relation = str_replace('by_', '', $key);

                    if ($relation === 'state' || $relation === 'city') {
                        $scopeName = 'withMainAddressIn' . ucfirst($relation);
                        $criteria[] = new QueryCriteria($scopeName, $value, 'hasScope');
                        continue;
                    }

                    if ($relation === 'buyer') {
                        $criteria[] = new QueryCriteria('withBuyer', $value, 'hasScope');
                        continue;
                    }

                    $criteria[] = new QueryCriteria("{$relation}_id", $value);
                    continue;
                }

                if ($key === 'unavailable') {
                    if ($value === 'false') {
                        continue;
                    }

                    $criteria[] = new QueryCriteria('isUnavailable', $value, 'hasScope');
                    continue;
                }

                if ($key === 'reference' || $key === 'search') {
                    $cnpjPattern = '/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/';
                    $isCNPJ = preg_match($cnpjPattern, $value);
                    if ($isCNPJ == 0) {
                        $criteria[] = new QueryCriteria('company_name', "%$value%", 'like');
                    } elseif($isCNPJ == 1) {
                        $criteria[] = new QueryCriteria('document', "%$value%", 'like');
                    }
                    continue;
                }

                if ($key === 'commercial_status') {
                    if ($value === 'Indefinido') {
                        $criteria[] = new QueryCriteria('emptyStatus', null, 'hasScope');
                        continue;
                    }

                    $criteria[] = new QueryCriteria('commercial_status', $value);
                    continue;
                }

                if ($key === 'last_order') {
                    $value = intval($value);
                    $criteria[] = new QueryCriteria('hasOrdersLastDays', $value, 'hasScope');
                    continue;
                }

                if (str_contains($key, 'date_')) {
                    $operation = str_contains($key, 'up') ? '>=' : '<=';
                    $criteria[] = new QueryCriteria('auge_register', $value, $operation);
                    continue;
                }

                if (str_contains($key, 'with')) {
                    $scopeName = str_contains($key, 'without_') ? 'notBlockedForSuppliers' : 'blockedForSuppliers';
                    $value = explode(",", $value);
                    $criteria[] = new QueryCriteria($scopeName, $value, 'hasScope');
                    continue;
                }

                if ($key === 'document_status') {
                    $criteria[] = new QueryCriteria('document_status', ['Ativo', 'Ativa'], 'whereIn');
                    continue;
                }

                $criteria[] = new QueryCriteria($key, $value);
            }

            if (count($criteria)) {
                $this->criteria = new QueryCriteriaCollection('and', ...$criteria);
            }
        }
    }

    /**
     * @throws Throwable
     */
    public function show($id): ?Model
    {
        $this->relations = [
            'contacts.role',
            'addresses.state',
            'addresses.type',
            'bankAccounts.bank',
            'blockingRule',
        ];

        return parent::getById($id);
    }

    /**
     * @throws Exception
     */
    public function revalidateWithExternalApiData(Client $client, $externalApiData)
    {
        try {
            $clientUpdateData = [];
            foreach ($externalApiData as $key => $value) {
                if ($client->$key != $value) {
                    $clientUpdateData[$key] = $value;
                }
            }

            if (!empty($clientUpdateData)) {
                $client->update($clientUpdateData);
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
