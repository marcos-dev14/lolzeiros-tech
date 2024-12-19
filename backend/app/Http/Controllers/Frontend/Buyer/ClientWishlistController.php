<?php

namespace App\Http\Controllers\Frontend\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Product;
use App\Services\ClientSessionManager;
use App\Services\SupplierService;
use App\Services\Utils\QueryCriteria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ClientWishlistController extends Controller
{
    public function __construct(
        protected ClientSessionManager $sessionManager,
        protected SupplierService $supplierService
    ) {}

    protected function getClient(): ?Client
    {
        return $this->sessionManager->getSessionSelectedClient();
    }

    public function wishlist(Request $request): View
    {
        $client = $this->getClient();
        $products = $client->wishlistProducts();

        $supplierIds = $products->clone()->groupBy('supplier_id')->pluck('supplier_id');
        $this->supplierService->criteria = new QueryCriteria('id', $supplierIds->toArray(), 'in');
        $this->supplierService->fields = ['id', 'name'];
        $suppliers = $this->supplierService->all(false)->pluck('name', 'id');

        $selectedSupplier = $request->rp;
        if ($selectedSupplier) {
            $products->where('supplier_id', $selectedSupplier);
        }

        $products = $products->paginate(9);

        return view('pages.buyer.wishlist', compact(
            'client',
            'products',
            'suppliers',
            'selectedSupplier'
        ));
    }

    public function wishlistAdd(Product $product): JsonResponse
    {
        $client = $this->getClient();
        if (!$client->wishlistProducts->contains($product)) {
            $client->wishlistProducts()->attach($product);
            $client->load('wishlistProducts');
            $this->sessionManager->setSelectedClient($client);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Produto adicionado aos favoritos'
        ]);
    }

    public function wishlistRemove(Product $product): JsonResponse
    {
        $client = $this->getClient();
        if ($client->wishlistProducts->contains($product)) {
            $client->wishlistProducts()->detach($product);
            $client->load('wishlistProducts');
            $this->sessionManager->setSelectedClient($client);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Produto removido dos favoritos'
        ]);
    }
}
