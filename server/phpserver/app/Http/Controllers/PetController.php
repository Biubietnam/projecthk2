<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pet;


class PetController extends Controller
{
    public function index()
    {
        return response()->json(Pet::all());
    }

    public function show($id)
    {
        $pet = Pet::findOrFail($id);
        return response()->json($pet);
    }


}
