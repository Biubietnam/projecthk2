<?php

namespace App\Http\Controllers;

use App\Models\AdoptionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdoptionRequestController extends Controller
{
    public function index()
    {
        return AdoptionRequest::with('user', 'pet')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'note' => 'nullable|string',
        ]);

        $alreadyAdopted = \App\Models\Pet::find($request->pet_id)?->adopted;
        if ($alreadyAdopted) {
            return response()->json(['message' => 'This pet has already been adopted.'], 400);
        }

        $adoption = AdoptionRequest::create([
            'user_id' => Auth::id(),
            'pet_id' => $request->pet_id,
            'note' => $request->note,
            'requested_at' => now(),
        ]);

        return response()->json(['message' => 'Adoption request submitted.', 'data' => $adoption]);
    }

    public function approve($id)
    {
        $request = AdoptionRequest::with('pet')->findOrFail($id);

        if ($request->pet->adopted) {
            return response()->json(['message' => 'Pet already adopted.'], 400);
        }

        $request->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        $request->pet->update([
            'adopted' => true,
        ]);

        AdoptionRequest::where('pet_id', $request->pet_id)
            ->where('id', '!=', $request->id)
            ->update(['status' => 'rejected']);

        return response()->json(['message' => 'Adoption approved.']);
    }

    public function reject($id)
    {
        $request = AdoptionRequest::findOrFail($id);

        $request->update([
            'status' => 'rejected',
        ]);

        return response()->json(['message' => 'Adoption request rejected.']);
    }

    public function destroy($id)
    {
        $request = AdoptionRequest::findOrFail($id);
        $request->delete();

        return response()->json(['message' => 'Adoption request deleted.']);
    }
}

