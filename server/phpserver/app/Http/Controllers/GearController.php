<?php

namespace App\Http\Controllers;

use App\Models\Gear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GearController extends Controller
{
    public function index()
    {
        $gears = Gear::all()->map(function ($gear) {
            $reviews = DB::table('reviews')->where('gear_id', $gear->id)->get();

            return collect($gear)->merge([
                'reviews_count' => $reviews->count(),
                'rating' => $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 5,
            ]);
        });

        return response()->json($gears, 200);
    }

    public function show($id)
    {
        $gear = Gear::find($id);
        if (!$gear) {
            return response()->json(['message' => 'Gear not found'], 404);
        }

        $reviews = DB::table('reviews')->where('gear_id', $gear->id)->get();

        return response()->json(
            collect($gear)->merge([
                'reviews' => $reviews,
                'reviews_count' => $reviews->count(),
                'rating' => $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 5,
            ]),
            200
        );
    }


    public function store(Request $request)
    {
        $request->merge([
            'slug' => $request->filled('slug') ? $request->slug : Str::slug($request->name)
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:gears,name',
            'slug' => 'nullable|string|max:255|unique:gears,slug',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'petType' => 'required|string',
            'category' => 'required|string',
            'main_image' => 'nullable|url',
            'images' => 'nullable|array',
            'images.*' => 'nullable|url',
            'highlights' => 'nullable|array',
            'details' => 'nullable|string',
            'shipping_info' => 'nullable|string',
            'return_policy' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'sale_percent' => 'nullable|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $requestData = $request->all();
        $requestData['rating'] = 5;
        $requestData['reviews_count'] = 0;

        $gear = Gear::create($requestData);
        return response()->json($gear, 201);
    }

    public function update(Request $request, $id)
    {
        $gear = Gear::find($id);
        if (!$gear) {
            return response()->json(['message' => 'Gear not found'], 404);
        }

        $request->merge([
            'slug' => $request->filled('slug') ? $request->slug : Str::slug($request->name)
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:gears,name,' . $gear->id,
            'slug' => 'nullable|string|max:255|unique:gears,slug,' . $gear->id,
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'petType' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'main_image' => 'sometimes|nullable|url',
            'images' => 'sometimes|nullable|array',
            'images.*' => 'sometimes|nullable|url',
            'highlights' => 'sometimes|nullable|array',
            'details' => 'sometimes|nullable|string',
            'shipping_info' => 'sometimes|nullable|string',
            'return_policy' => 'sometimes|nullable|string',
            'stock' => 'sometimes|nullable|integer|min:0',
            'rating' => 'sometimes|nullable|numeric|min:0|max:5',
            'reviews_count' => 'sometimes|nullable|integer|min:0',
            'is_featured' => 'sometimes|nullable|boolean',
            'is_new' => 'sometimes|nullable|boolean',
            'sale_percent' => 'sometimes|nullable|integer|min:0|max:100',
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
            'is_featured',
            'is_new',
            'sale_percent'
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
