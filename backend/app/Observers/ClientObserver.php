<?php

namespace App\Observers;

use App\Models\Client;
use Mavinoo\Batch\BatchFacade;

class ClientObserver
{
    public function creating(Client $client)
    {
        $client->code = makeUniqueHashFromModel(
            $client,
            'code',
            6,
            true
        );

        if (empty($client->commercial_status)) {
            $client->commercial_status = 'Prospeccao';
        }
    }

    public function updated(Client $client)
    {
        if ($client->isDirty('client_profile_id')) {
            $group = $client->group;
            $groupClients = $group->clients;

            if (count($groupClients)) {
                $fields = [];
                foreach ($groupClients as $groupClient) {
                    if ($groupClient->id === $client->id) {
                        continue;
                    }

                    $fields[] = [
                        'id' => $groupClient->id,
                        'client_profile_id' => $client->client_profile_id
                    ];
                }

                BatchFacade::update(new ($client::class), $fields, 'id');
            }
        }
    }
}
