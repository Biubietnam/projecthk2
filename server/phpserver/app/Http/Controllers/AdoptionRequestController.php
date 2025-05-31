<?php

namespace App\Http\Controllers;

use App\Models\AdoptionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\AdoptionRequestReceived;
use Illuminate\Support\Facades\Mail;
use App\Models\AdoptionResponse;
use Illuminate\Validation\Rule;
use App\Mail\AdoptionRequestApproved;

class AdoptionRequestController extends Controller
{
    public function index()
    {
        return AdoptionRequest::with('user', 'pet')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pet_id' => [
                'required',
                Rule::exists('pets', 'id')->whereNull('deleted_at'),
            ],
            'note' => 'required|string|max:500',
        ]);

        $user = Auth::user();
        if ($user->hasAdoptionRequestForPet($request->pet_id)) {
            return response()->json(['message' => 'You have already requested to adopt this pet.'], 400);
        }

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

        Mail::to(Auth::user()->email)->send(new AdoptionRequestReceived($adoption));
        return response()->json(['message' => 'Adoption request submitted.', 'data' => $adoption]);
    }

    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'note' => 'nullable|string|max:500',
            'scheduled_at' => 'nullable|date',
        ]);

        $adoptionRequest = AdoptionRequest::with('pet')->findOrFail($id);

        if ($adoptionRequest->pet->adopted) {
            return response()->json(['message' => 'Pet already adopted.'], 400);
        }

        $adoptionRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        $adoptionRequest->pet->update(['adopted' => true]);

        $response = AdoptionResponse::create([
            'adoption_request_id' => $adoptionRequest->id,
            'responder_id' => Auth::id(),
            'action' => 'approved',
            'note' => $validated['note'] ?? null,
            'responded_at' => now(),
        ]);
        Mail::to($adoptionRequest->user->email)->send(
            new AdoptionRequestApproved($adoptionRequest, $response)
        );

        $otherRequests = AdoptionRequest::where('pet_id', $adoptionRequest->pet_id)
            ->where('id', '!=', $adoptionRequest->id)
            ->get();

        foreach ($otherRequests as $request) {
            $request->update([
                'status' => 'rejected',
                'note' => 'Automatically rejected because the pet has already been adopted.',
            ]);

            AdoptionResponse::create([
                'adoption_request_id' => $request->id,
                'responder_id' => Auth::id(),
                'action' => 'rejected',
                'note' => 'Auto-rejected due to another adoption approval.',
                'responded_at' => now(),
            ]);
            Mail::to($request->user->email)->send(
                new \App\Mail\AdoptionRequestRejected($request, $response)
            );
        }

        return response()->json(['message' => 'Adoption approved.']);
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'note' => 'nullable|string|max:500',
        ]);

        $adoptionRequest = AdoptionRequest::findOrFail($id);
        $adoptionRequest->update([
            'status' => 'rejected',
            'note' => $validated['note'] ?? null,
            'rejected_at' => now(),
        ]);

        $response = AdoptionResponse::create([
            'adoption_request_id' => $adoptionRequest->id,
            'responder_id' => Auth::id(),
            'action' => 'rejected',
            'note' => $validated['note'] ?? null,
            'responded_at' => now(),
        ]);

        Mail::to($adoptionRequest->user->email)->send(
            new \App\Mail\AdoptionRequestRejected($adoptionRequest, $response)
        );
        return response()->json(['message' => 'Adoption request rejected.']);
    }

    public function destroy($id)
    {
        $request = AdoptionRequest::findOrFail($id);
        $request->delete();

        return response()->json(['message' => 'Adoption request deleted.']);
    }

    public function check($petId)
    {
        $user = Auth::user();

        $hasRequest = $user->hasAdoptionRequestForPet($petId);

        return response()->json(['has_request' => $hasRequest]);
    }
}
