<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Auth::user()->profile;

        return response()->json($profile);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'gender' => 'nullable|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'avatar_url' => 'nullable|string',
        ]);

        $user = Auth::user();
        $profile = $user->profile ?? $user->profile()->create();


        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->update($validated);

        return response()->json($profile);
    }
}

