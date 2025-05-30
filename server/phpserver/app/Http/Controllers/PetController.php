<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PetController extends Controller
{
    public function index()
    {
        $availablePets = Pet::where(function ($query) {
            $query->where('adopted', 0)->orWhereNull('adopted');
        })->get();

        return response()->json($availablePets, 200);
    }

    public function show($id)
    {
        $pet = Pet::find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        if ($pet->adopted) {
            return response()->json(['message' => 'This pet has already been adopted'], 410); // 410 Gone
        }

        return response()->json($pet, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'breed'          => 'nullable|string',
            'age'            => 'nullable|string',
            'weight'         => 'nullable|string',
            'color'          => 'nullable|string',
            'adoptionFee'    => 'nullable|numeric',
            'type'           => 'nullable|string',
            'gender'         => 'nullable|in:Male,Female',
            'tags'           => 'nullable|array',
            'description'    => 'nullable|string',
            'careDiet'       => 'nullable|string',
            'careExercise'   => 'nullable|string',
            'careGrooming'   => 'nullable|string',
            'adopted'        => 'nullable|boolean',
            'images'         => 'nullable',
            'main_image'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = collect($validator->validated())->map(function ($value) {
            return is_string($value) ? trim($value) : $value;
        })->toArray();

        $pet = Pet::create($validated);

        return response()->json($pet, 201);
    }

    public function update(Request $request, $id)
    {
        $pet = Pet::find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'           => 'sometimes|required|string|max:255',
            'breed'          => 'sometimes|nullable|string',
            'age'            => 'sometimes|nullable|string',
            'weight'         => 'sometimes|nullable|string',
            'color'          => 'sometimes|nullable|string',
            'adoptionFee'    => 'sometimes|nullable|numeric',
            'type'           => 'sometimes|nullable|string',
            'gender'         => 'sometimes|nullable|in:Male,Female',
            'tags'           => 'sometimes|nullable|array',
            'tags.*' => 'string|max:30',
            'description'    => 'sometimes|nullable|string',
            'careDiet'       => 'sometimes|nullable|string',
            'careExercise'   => 'sometimes|nullable|string',
            'careGrooming'   => 'sometimes|nullable|string',
            'adopted'        => 'sometimes|nullable|boolean',
            'images'         => 'sometimes|nullable|array',
            'images.*' => 'url|string|max:500',
            'main_image' => 'nullable|string|max:500|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = collect($validator->validated())->map(function ($value) {
            return is_string($value) ? trim($value) : $value;
        })->toArray();

        $pet->update($validated);

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

    public function restore($id)
    {
        $pet = Pet::onlyTrashed()->find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found or not deleted'], 404);
        }

        $pet->restore();
        return response()->json(['message' => 'Pet restored successfully'], 200);
    }
}
