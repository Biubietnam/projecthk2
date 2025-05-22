<?php

namespace App\Http\Controllers;

use App\Models\Gear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GearController extends Controller
{
    public function index()
    {
        return response()->json(Gear::all(), 200);
    }

    public function show($id)
    {
        $gear = Gear::find($id);
        if (!$gear) {
            return response()->json(['message' => 'Gear not found'], 404);
        }
        return response()->json($gear, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'petType' => 'required|string',
            'category' => 'required|string',
            'main_image' => 'nullable|string',
            'images' => 'nullable',
            'highlights' => 'nullable',
            'details' => 'nullable|string',
            'shipping_info' => 'nullable|string',
            'return_policy' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
            'reviews_count' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $gear = Gear::create($request->all());
        return response()->json($gear, 201);
    }

    public function update(Request $request, $id)
    {
        $gear = Gear::find($id);
        if (!$gear) {
            return response()->json(['message' => 'Gear not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'petType' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'main_image' => 'sometimes|nullable|string',
            'images' => 'sometimes|nullable',
            'highlights' => 'sometimes|nullable',
            'details' => 'sometimes|nullable|string',
            'shipping_info' => 'sometimes|nullable|string',
            'return_policy' => 'sometimes|nullable|string',
            'stock' => 'sometimes|nullable|integer|min:0',
            'rating' => 'sometimes|nullable|numeric|min:0|max:5',
            'reviews_count' => 'sometimes|nullable|integer|min:0',
            'is_featured' => 'sometimes|nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'name',
            'slug',
            'description',
            'price',
            'petType',
            'category',
            'main_image',
            'images',
            'highlights',
            'details',
            'shipping_info',
            'return_policy',
            'stock',
            'rating',
            'reviews_count',
            'is_featured'
        ]);

        $gear->update($data);

        return response()->json($gear, 200);
    }


    public function destroy($id)
    {
        $gear = Gear::find($id);
        if (!$gear) {
            return response()->json(['message' => 'Gear not found'], 404);
        }

        $gear->delete();
        return response()->json(['message' => 'Gear deleted successfully'], 200);
    }
}
