<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Frontend\BaseController;
use App\Http\Resources\ClientListCartResource;
use App\Models\BlockedSupplier;
use App\Models\ClientHasSeller;
use App\Models\CountryState;
use App\Models\Opportunity;
use App\Models\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\SupplierDiscount;
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

        $suppliers = Supplier::query()
            ->where('is_available', 1)
            ->where('suspend_sales', 0)
            ->where('service_migrate', 'Ativado')
            ->has('installmentRules')
            ->whereDoesntHave('blockedSuppliers', fn($query) => $query->where('seller_id', $seller->id))
            ->get()
            ->map(fn($supplier) => [
                'id' => $supplier->id,
                'slug' => $supplier->slug,
                'name' => $supplier->name,
                'image_url' => $supplier->getImagePath() . $supplier->webp_image
            ]);

        return view('pages.sellers.opportunities.index', compact('suppliers', 'seller'));
    }

    public function opportunitiesFromSupplier($supplierSlug)
    {
        $seller = auth()->guard('seller')->user();

        if (!$seller) {
            return redirect()
                ->route('seller.login')
                ->with('error', 'Você precisa estar autenticado para acessar esta página.');
        }

        $supplier = Supplier::where('slug', $supplierSlug)->first();

        if (!$supplier) {
            return redirect()
                ->route('seller.opportunities.index')
                ->with('error', 'Fornecedor não encontrado.');
        }

        $perPage = 15;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $countryStates = CountryState::pluck('name', 'id')->toArray();

        $opportunities = Opportunity::orderByDesc('created_at')->where('supplier_id', $supplier->id)
            ->with([
                'clientGroup.clients' => function ($query) {
                    $query->select('id', 'client_group_id', 'company_name', 'name', 'document', 'document_status', 'client_profile_id', 'auge_register');
                }
            ])
            ->paginate($perPage, ['*'], 'page', $currentPage);

        $clients = $opportunities->sortByDesc('created_at')->flatMap(function ($opportunity) use ($countryStates, $supplier) {
            $groupName = $opportunity->clientGroup->name ?? null;
            $lastLogin = optional($opportunity->clientGroup->buyer)->last_login;

            $formattedLastLogin = $lastLogin
                ? Carbon::parse($lastLogin)->format('d/m/Y H:i') . 'h (' . Carbon::parse($lastLogin)->diffForHumans() . ')'
                : null;

            return $opportunity->clientGroup->clients->map(function ($client) use ($groupName, $formattedLastLogin, $countryStates, $supplier, $opportunity) {
                $mainAddress = $client->getMainAddress();
                $clientStateCode = $mainAddress?->state?->code;
                $stateDiscount = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                    $query->where('code', $clientStateCode);
                })->first();

                $state = $mainAddress?->country_state_id
                    ? ($countryStates[$mainAddress->country_state_id] ?? null)
                    : null;

                $icmsDiscount = 0;
                if ($stateDiscount instanceof SupplierDiscount) {
                    $icmsDiscount += floatval($stateDiscount->discount_value);
                    $icmsDiscount += floatval($stateDiscount->additional_value);
                }

                $clientProfile = $client->client_profile_id;
                $profileDiscount = $supplier->profileDiscounts->where('client_profile_id', $clientProfile)->first();

                return (object)[
                    'group' => $groupName,
                    'name' => $client->company_name ?? $client->name,
                    'profile' => $client->profile->name ?? null,
                    'document' => $client->document ?? null,
                    'state' => $state ? "{$state} - {$mainAddress->code}" : null,
                    'icms' => $icmsDiscount,
                    'profile_discount' => $profileDiscount->discount_value ?? 0,
                    'commercial_commission' => $profileDiscount->commercial_commission ?? 0,
                    'fractional_box' => $supplier['fractional_box'] ?? 0,
                    'register' => optional($client->auge_register)->format('d/m/Y H:i'),
                    'lastLogin' => $formattedLastLogin,
                    'cartAbandoned' => $client->cart?->products?->count()
                        ? (new ClientListCartResource($client->cart))->created_at
                        : null,
                    'status' => $client->document_status,
                    'opportunityData' => $opportunity->created_at,
                ];
            });
        });

        return view('pages.sellers.opportunities.opportunitiesFromSupplier', compact('clients', 'opportunities', 'seller'));
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
