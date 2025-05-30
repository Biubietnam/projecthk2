<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PetController extends Controller
{
    public function index()
    {
        $availablePets = Pet::where('adopted', 0)->orWhereNull('adopted')->get();
        return response()->json($availablePets, 200);   
    }

    public function show($id)
    {
        $pet = Pet::find($id);
        if ($pet && $pet->adopted) {
            return response()->json(['message' => 'This pet has already been adopted'], 404);
        }
        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }
        return response()->json($pet, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string',
            'age' => 'nullable|string',
            'weight' => 'nullable|string',
            'color' => 'nullable|string',
            'adoptionFee' => 'nullable|numeric',
            'type' => 'nullable|string',
            'gender' => 'nullable|string',
            'tags' => 'nullable',
            'description' => 'nullable|string',
            'careDiet' => 'nullable|string',
            'careExercise' => 'nullable|string',
            'careGrooming' => 'nullable|string',
            'adopted' => 'nullable|boolean',
            'images' => 'nullable',
            'main_image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pet = Pet::create($validator->validated());
        return response()->json($pet, 201);
    }

    public function update(Request $request, $id)
    {
        $pet = Pet::find($id);
        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'breed' => 'sometimes|nullable|string',
            'age' => 'sometimes|nullable|string',
            'weight' => 'sometimes|nullable|string',
            'color' => 'sometimes|nullable|string',
            'adoptionFee' => 'sometimes|nullable|numeric',
            'type' => 'sometimes|nullable|string',
            'gender' => 'sometimes|nullable|string',
            'tags' => 'sometimes|nullable',
            'description' => 'sometimes|nullable|string',
            'careDiet' => 'sometimes|nullable|string',
            'careExercise' => 'sometimes|nullable|string',
            'careGrooming' => 'sometimes|nullable|string',
            'adopted' => 'sometimes|nullable|boolean',
            'images' => 'sometimes|nullable',
            'main_image' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pet->update($validator->validated());

        return response()->json($pet, 200);
    }

    public function destroy($id)
    {
        $pet = Pet::find($id);
        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        $pet->delete();
        return response()->json(['message' => 'Pet deleted successfully'], 200);
    }
}
