<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show($id)
    {
        $user = User::with('profile')->findOrFail($id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'profile' => $user->profile
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

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
