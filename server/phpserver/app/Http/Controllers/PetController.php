<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string',
            'age' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'color' => 'nullable|string',
            'adoptionFee' => 'nullable|numeric',
            'type' => 'nullable|string',
            'gender' => 'nullable|string',
            'tags' => 'nullable|array',
            'description' => 'nullable|string',
            'careDiet' => 'nullable|string',
            'careExercise' => 'nullable|string',
            'careGrooming' => 'nullable|string',
            'adopted' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('pets', 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        $pet = Pet::create($data);
        return response()->json(['message' => 'Pet created', 'pet' => $pet], 201);
    }

    public function update(Request $request, $id)
    {
        $pet = Pet::findOrFail($id);

        $data = $request->all();

        if ($request->has('tags') && is_string($request->tags)) {
            $data['tags'] = json_decode($request->tags, true);
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('pets', 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        $pet->update($data);

        return response()->json(['message' => 'Pet updated', 'pet' => $pet]);
    }

    public function destroy($id)
    {
        $pet = Pet::findOrFail($id);
        $pet->delete();

        return response()->json(['message' => 'Pet deleted']);
    }
}
