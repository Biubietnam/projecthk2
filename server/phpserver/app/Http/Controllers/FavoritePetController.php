<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class FavoritePetController extends Controller
{
    public function toggle(Request $request, $petId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $pet = Pet::findOrFail($petId);

        if ($user->favoritePets()->where('pet_id', $petId)->exists()) {
            $user->favoritePets()->detach($petId);
            return response()->json(['message' => 'Pet removed from favorites']);
        } else {
            $user->favoritePets()->attach($petId);
            return response()->json(['message' => 'Pet added to favorites']);
        }
    }

    //Check with id
    public function check(Request $request, $petId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isFavorite = $user->favoritePets()->where('pet_id', $petId)->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }

    public function list()
    {
        $user = Auth::user();
        return response()->json($user->favoritePets);
    }
}

