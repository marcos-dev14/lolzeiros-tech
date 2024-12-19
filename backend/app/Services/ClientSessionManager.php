<?php

namespace App\Services;

use App\Models\Buyer;
use App\Models\Client;
use Exception;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

class ClientSessionManager
{
    public function loginUsingId(int $buyerId): void
    {
        auth()->guard('buyer')->loginUsingId($buyerId);
    }

    /**
     * @throws Throwable
     */
    public function setSessionClient(int $clientId = null): void
    {
        $buyer = $this->getBuyer();

        $selectedClient = null;
        $clients = null;

        if ($buyer) {
            throw_if(!$buyer->active, new Exception(
                'Seu acesso está temporariamente bloqueado. Entre em contato com nossa equipe.'
            ));

            $clients = $buyer->clients()->with(
                'profile',
                'group',
                'addresses',
                'addresses.state',
                'blockedSuppliers',
                'blockingRule',
                'wishlistProducts',
                'pdvType'
            )->where(function ($query) {
                $query->where('commercial_status', 'Ativo')
                    ->orWhere('commercial_status', 'Prospecção');
            })->get();

            throw_if(
                !count($clients),
                new Exception(
                    'Você precisa ter uma ou mais lojas ligadas aos seus dados de login para acessar o
                     nosso site. Entre em contato com a Auge pra mais detalhes: ' . config('square_config.phone_two', '(31) 3213.2204')
            ));

            $selectedClient = ($clients->contains($clientId)) ? $clients->find($clientId) : $clients?->first();
        }

        $this->setSelectedClient($selectedClient);
        $this->setAllClients($clients);
    }

    public function setSelectedClient(Client|null $client): void
    {
        session(['buyer.clients.selected' => $client]);
    }

    public function setAllClients(Collection|null $clients): void
    {
        session(['buyer.clients.all' => $clients]);
    }

    public function getSessionAllClients()
    {
        return session('buyer.clients.all');
    }

    public function getSessionSelectedClient(): ?Client
    {
        return session('buyer.clients.selected');
    }

    public function getBuyer(): Authenticatable|Buyer|null
    {
        return auth()->guard('buyer')->user();
    }
}
