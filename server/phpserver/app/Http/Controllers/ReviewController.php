<?php

namespace App\Http\Controllers;

use App\Models\Gear;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index($gearId)
    {
        $gear = Gear::findOrFail($gearId);
        return response()->json($gear->reviews);
    }

    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);


        $gear = Gear::findOrFail($id);

        $gear->reviews()->create([
            'gear_id' => $id,
            'user_id' => $validated['user_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        $gear->rating = $gear->reviews()->avg('rating');
        $gear->reviews_count = $gear->reviews()->count();
        $gear->save();

        return response()->json(['message' => 'Review added successfully']);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        $gear = $review->gear;
        $gear->rating = $gear->reviews()->avg('rating');
        $gear->reviews_count = $gear->reviews()->count();
        $gear->save();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
