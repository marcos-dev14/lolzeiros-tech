<?php

namespace App\Console\Commands;

use App\Models\ClientGroup;
use App\Models\ClientHasSeller;
use App\Models\Opportunity;
use App\Models\Seller;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckCustomerLoyalty extends Command
{
    protected $signature = 'check:customer-loyalty';
    protected $description = 'Verifica a fidelidade dos clientes e cria oportunidades se necessário.';

    public function handle()
    {
        $this->info('Iniciando verificação de fidelidade dos clientes.');

        try {
            $suppliers = $this->getActiveSuppliers();

            foreach ($suppliers as $supplier) {
                $clientsGroups = $this->getClientGroups();

                foreach ($clientsGroups as $clientGroup) {
                    $clientHasSeller = $this->getClientHasSeller($clientGroup->id, $supplier->id);
                    $isSupplierBlockedByClientGroup = $this->isSupplierBlockedByClientGroup($clientGroup, $supplier->id);

                    if ($clientHasSeller) {
                        $this->processLoyalty($clientGroup, $supplier, $clientHasSeller, $isSupplierBlockedByClientGroup);
                    } else {
                        $this->createNewClientHasSeller($clientGroup, $supplier, $isSupplierBlockedByClientGroup);
                    }
                }
            }

            $this->info('Verificação de fidelidade concluída.');
            Log::info('Verificação de fidelidade concluída.');
        } catch (\Exception $e) {
            Log::error('Erro ao verificar fidelidade dos clientes: ' . $e->getMessage());
        }
    }

    private function getActiveSuppliers()
    {
        return Supplier::query()
            ->where('is_available', 1)
            ->where('suspend_sales', 0)
            ->where('service_migrate', 'Ativado')
            ->has('installmentRules')
            ->get();
    }

    private function getClientGroups()
    {
        return ClientGroup::with(['clients.orders', 'buyer'])->get();
    }

    private function getClientHasSeller($clientGroupId, $supplierId)
    {
        return ClientHasSeller::where('client_group_id', $clientGroupId)
            ->where('supplier_id', $supplierId)
            ->first();
    }

    private function processLoyalty($clientGroup, $supplier, $clientHasSeller, $isSupplierBlockedByClientGroup)
    {
        $loyaltyDays = $supplier->loyalty ?? 0;
        $lastOrder = $this->getLastOrder($clientGroup, $supplier->id);
        $existingOpportunity = $this->opportunityExists($clientGroup->id, $supplier->id);

        if (!$clientHasSeller->seller_id && !$existingOpportunity && $clientGroup->service_migrate === 'Ativado' && $isSupplierBlockedByClientGroup) {
            $this->createOpportunity($clientGroup->id, $supplier->id, 'Fidelidade expirada');
        } elseif ($lastOrder && !$existingOpportunity && $clientGroup->service_migrate === 'Ativado' && $isSupplierBlockedByClientGroup) {
            $this->handleOrderLoyalty($lastOrder, $supplier, $clientHasSeller, $clientGroup->id);
        } elseif (!$lastOrder && !$existingOpportunity && $clientGroup->service_migrate === 'Ativado' && $isSupplierBlockedByClientGroup) {
            $this->createOpportunity($clientGroup->id, $supplier->id, 'Fidelidade expirada');
        }
    }

    private function getLastOrder($clientGroup, $supplierId)
    {
        return $clientGroup->clients
            ->map(fn($client) => $client->orders->last())
            ->filter()
            ->where('product_supplier_id', $supplierId)
            ->sortByDesc('created_at')
            ->first();
    }

    private function isSupplierBlockedByClientGroup($clientGroup, $supplierId)
    {
        foreach ($clientGroup->clients as $client) {
            if ($client->blockedSuppliers->contains('product_supplier_id', $supplierId)) {
                return false;
            }
        }

        return true;
    }

    private function opportunityExists($clientGroupId, $supplierId)
    {
        return Opportunity::where('client_group_id', $clientGroupId)
            ->where('supplier_id', $supplierId)
            ->exists();
    }

    private function handleOrderLoyalty($lastOrder, $supplier, $clientHasSeller, $clientGroupId)
    {
        if (now()->greaterThan(Carbon::parse($lastOrder->created_at)->addDays($supplier->loyalty ?? 0))) {
            $seller = $clientHasSeller->seller;
            if ($seller && $seller->portfolio_customer === 'Dinâmica') {
                $clientHasSeller->update(['seller_id' => null]);
                $this->createOpportunity($clientGroupId, $supplier->id, 'Fidelidade expirada');
            }
        }
    }

    private function createNewClientHasSeller($clientGroup, $supplier, $isSupplierBlockedByClientGroup)
    {
        ClientHasSeller::create([
            'client_group_id' => $clientGroup->id,
            'supplier_id' => $supplier->id,
        ]);

        $this->info("Vinculo criado: grupo {$clientGroup->id}, fornecedor {$supplier->id}");

        if ($clientGroup->service_migrate === 'Ativado' && $isSupplierBlockedByClientGroup) {
            $this->createOpportunity($clientGroup->id, $supplier->id, 'Fidelidade expirada');
        }
    }

    private function createOpportunity($clientGroupId, $supplierId, $description)
    {
        if (!$this->opportunityExists($clientGroupId, $supplierId)) {
            Opportunity::create([
                'client_group_id' => $clientGroupId,
                'supplier_id' => $supplierId,
            ]);
            $this->info("Oportunidade criada: grupo {$clientGroupId}, fornecedor {$supplierId}");
        }
    }
}
