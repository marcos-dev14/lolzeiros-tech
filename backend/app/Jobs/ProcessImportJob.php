<?php

namespace App\Jobs;

use Exception;

use App\Models\Client;
use App\Models\Product;
use App\Models\Supplier;
use App\Services\CartService;

use App\Traits\Loggable;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ProcessImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Loggable;

    protected $filePath;
    protected $clientId;
    protected $supplierId;
    protected $importId;

    public function __construct($filePath, $clientId, $supplierId, $importId)
    {
        $this->filePath = $filePath;
        $this->clientId = $clientId;
        $this->supplierId = $supplierId;
        $this->importId = $importId;
    }

    public function handle(CartService $cartService)
    {
        try {
            $clientId = $this->clientId;
            $supplierId = $this->supplierId;
            $filePath = $this->filePath;
            $importId = $this->importId;

            $client = Client::find($clientId);

            Log::info("Iniciando importação: {$this->importId}");
            Log::info("Arquivo: {$this->filePath}, Cliente: {$this->clientId}, Fornecedor: {$this->supplierId}");

            if (!$client) {
                Log::error("Cliente não encontrado para o ID: $clientId");
                return;
            }

            $logKey = "import_logs_{$clientId}_{$supplierId}_{$importId}";
            $sessionKey = "import_progress_{$clientId}_{$supplierId}_{$importId}";

            Cache::put($sessionKey, 0, now()->addMinutes(10));
            Cache::put($logKey, [], now()->addMinutes(10));

            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            $storagePath = storage_path("app/{$filePath}");
            $data = $extension === 'csv' ? Excel::toCollection([], $storagePath) : Excel::toArray([], $storagePath)[0];

            if (empty($data)) {
                Log::error("Arquivo vazio ou inválido: {$filePath}");
                return;
            }

            $totalRows = count($data) - 1;

            $supplierName = Supplier::where('id', $supplierId)?->value('name');

            foreach (array_slice($data, 1) as $index => $doc) {
                $reference = trim($doc[0] ?? '');
                $qty = intval($doc[1] ?? 0);

                Log::info("Processando produto: {$reference}, Quantidade: {$qty}");

                $progress = intval(($index + 1) / $totalRows * 100);
                Cache::put($sessionKey, $progress, now()->addMinutes(10));

                if (empty($reference)) {
                    continue;
                }

                if (empty($qty) || $qty <= 0) {
                    $this->addLogMessage($logKey, "$reference não importado, quantidade zerada ou negativa na planilha.");
                    continue;
                }

                $product = Product::with('supplier')
                    ->where(function ($query) use ($reference) {
                        $query->where('reference', $reference)
                              ->orWhere('ean13', $reference);
                    })
                    ->where('supplier_id', $supplierId)
                    ->first();

                if (!$product) {
                    $otherSupplier = Product::where('reference', $reference)
                        ->orWhere('ean13', $reference)
                        ->first()?->supplier?->name;

                    $message = $otherSupplier
                        ? "{$reference}: Não pertence ao fornecedor {$supplierName}, encontrado em {$otherSupplier}."
                        : "{$reference}: Produto não encontrado.";

                    Log::info($message);
                    $this->addLogMessage($logKey, $message);

                    continue;
                }

                $availabilityIssues = in_array($product->availability, ['Fora de linha', 'Indisponível', 'Pré-venda']);

                if ($availabilityIssues) {
                    if ($product->availability === 'Fora de linha') {

                        $status = 'fora de Linha';

                    } elseif ($product->availability === 'Indisponível') {

                        $status = 'sem estoque imediato e não permitido reserva';

                    } elseif ($product->availability === 'Pré-venda') {
                        $this->addLogMessage($logKey, "$reference $qty peças importadas com sucesso em Pré Venda e ficará em saldo.");
                        continue;
                    }

                    $this->addLogMessage($logKey, "$reference não importado, status $status");
                    continue;
                }

                if (!$product || ($product instanceof Product && $product->canBeSold() !== true)) {
                    $this->addLogMessage($logKey, "$reference Este produto não está mais disponível");
                    continue;
                }

                $minTreatment = $qty;

                if($product->box_minimal != 0)
                {
                    $minTreatment = intval($product->box_minimal * ceil($qty / $product->box_minimal));
                }

                $cartService->addOrUpdateToCartToJob($client, $product, $minTreatment, true, $logKey);
                $cartService->setSessionCart($client);
                $cartService->setSessionSupplier($product->supplier?->id);

                $this->addLogMessage($logKey, "$reference, $minTreatment peças importadas com sucesso.");
            }

            $this->addLogMessage($logKey, "$reference, $minTreatment peças importadas com sucesso para seu carrinho auge!");

            Cache::put($sessionKey, 100, now()->addMinutes(10));

        } catch (\Exception $e) {
            Log::error("Erro no ProcessImportJob: " . $e->getMessage());
            $this->fail($e);
        }
    }

        public function failed(Exception $exception)
    {
        Log::error('JOB IMPORTACAO DE PEDIDO FALHOU', [
            'filePath' => $this->filePath,
            'clientId' => $this->clientId,
            'supplierId' => $this->supplierId,
            'importId' => $this->importId ?? 'N/A',
            'errorMessage' => $exception->getMessage(),
            'stackTrace' => $exception->getTraceAsString(),
        ]);
    }
}
