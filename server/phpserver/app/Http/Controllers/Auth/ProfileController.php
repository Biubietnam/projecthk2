<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class ProfileController extends Controller
{
    public function show()
    {

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated.'], 401);
        }
        $profile = $user->profile;
        if (!$profile) {
            return response()->json(['error' => 'User does not have a profile.'], 404);
        }
        return response()->json($profile, 200);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated.'], 401);
        }

        $profile = $user->profile;
        if (!$profile) {
            return response()->json(['error' => 'User does not have a profile.'], 404);
        }

        $validated = $request->validate([
            'full_name'     => 'nullable|string|max:255',
            'gender'        => 'nullable|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:255',
            'city'          => 'nullable|string|max:100',
            'country'       => 'nullable|string|max:100',
            'avatar'        => 'nullable|image|max:2048',
            'avatar_url'    => 'nullable|url',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar_url'] = '/storage/' . $path;
        }

        $profile->update($validated);

        return response()->json(['message' => '✅ Profile updated successfully.']);
    }
}
