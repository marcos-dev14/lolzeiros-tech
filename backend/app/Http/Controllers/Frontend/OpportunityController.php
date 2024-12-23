<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Frontend\BaseController;
use App\Models\Opportunity;
use App\Services\OpportunityService;
use Illuminate\Http\Request;

class OpportunityController extends BaseController
{
    public function __construct(
        private OpportunityService $entityService,
    ) {
    }
    /**
     * Display a listing of the opportunities.
     */

    public function index()
    {
        $this->entityService->relations = ['supplier', 'clientGroup'];
        $opportunities = $this->entityService->all();
        return view('pages.sellers.opportunities.index', compact('opportunities'));
    }
    
    /**
     * Store a newly created opportunity in storage.
     */
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

    /**
     * Display the specified opportunity.
     */
    public function show($id)
    {
        $opportunity = Opportunity::with(['clientGroup', 'supplier'])->findOrFail($id);
        return response()->json($opportunity);
    }

    /**
     * Update the specified opportunity in storage.
     */
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

    /**
     * Remove the specified opportunity from storage.
     */
    public function destroy($id)
    {
        $opportunity = Opportunity::findOrFail($id);
        $opportunity->delete();

        return response()->json(['message' => 'Opportunity deleted successfully.']);
    }
}
