<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Frontend\BaseController;
use App\Http\Resources\ClientListCartResource;
use App\Models\BlockedSupplier;
use App\Models\CountryState;
use App\Models\Opportunity;
use App\Services\OpportunityService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OpportunityController extends BaseController
{
    public function __construct(private OpportunityService $entityService) {}

    public function index()
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()->route('seller.login')->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $this->entityService->relations = ['supplier', 'clientGroup'];

        $opportunities = $this->entityService->all()->filter(function ($opportunity) use ($seller) {
            return !BlockedSupplier::where('seller_id', $seller->id)
                ->where('supplier_id', $opportunity->supplier->id)
                ->exists();
        });

        $opportunities = $opportunities->map(function ($opportunity) use ($seller) {
            $clientGroup = $opportunity->clientGroup;
            $client = $clientGroup->client;

            $lastLogin = $clientGroup->buyer && $clientGroup->buyer->last_login
                ? Carbon::parse($clientGroup->buyer->last_login)
                : Carbon::parse('0000-01-01 00:00:00');

            $groupName = $clientGroup->name;
            $supplierName = $opportunity->supplier->company_name ?? $opportunity->supplier->name;

            return $clientGroup->clients->map(function ($client) use ($groupName, $supplierName, $lastLogin) {
                $mainAddress = $client->getMainAddress();
                $state = $mainAddress?->country_state_id
                    ? CountryState::find($mainAddress->country_state_id)
                    : null;

                return (object) [
                    'grupo' => $groupName,
                    'fornecedor' => $supplierName,
                    'cliente' => $client->company_name ?? $client->name,
                    'cnpj' => $client->document ?? null,
                    'estado' => $state ? "{$state->name} - {$state->code}" : null,
                    'cadastro' => Carbon::parse($client->auge_register)->format('d/m/Y H:i'),
                    'ultimologin' => $lastLogin->format('d/m/Y H:i') . 'h (' . $lastLogin->diffForHumans() . ')',
                    'carrinhoabandonado' => $client->cart?->products?->count()
                        ? (new ClientListCartResource($client->cart))->created_at
                        : null,
                    'status' => $client->document_status,
                ];
            });
        });

        $paginatedOpportunities = $opportunities->flatten()->paginate(10);
         //dd($paginatedOpportunities);
        return view('pages.sellers.opportunities.index', compact('paginatedOpportunities', 'seller'));
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_group_id' => 'required|exists:client_groups,id',
            'supplier_id' => 'required|exists:product_suppliers,id',
        ]);

        $opportunity = Opportunity::create($validatedData);

        return response()->json($opportunity, 201);
    }

    public function show($id)
    {
        $opportunity = Opportunity::with(['clientGroup', 'supplier'])->findOrFail($id);
        return response()->json($opportunity);
    }

    public function update(Request $request, $id)
    {
        $opportunity = Opportunity::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'client_group_id' => 'sometimes|required|exists:client_groups,id',
            'supplier_id' => 'sometimes|required|exists:product_suppliers,id',
        ]);

        $opportunity->update($validatedData);

        return response()->json($opportunity);
    }

    public function destroy($id)
    {
        $opportunity = Opportunity::findOrFail($id);
        $opportunity->delete();

        return response()->json(['message' => 'Opportunity deleted successfully.']);
    }
}
