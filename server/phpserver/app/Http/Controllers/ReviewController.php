<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function unreviewed()
    {
        $userId = Auth::id();
        $receipts = DB::table('receipt')
            ->where('user_id', $userId)
            ->where('shipping_status', 'ordered')
            ->get();

        $unreviewed = [];

        foreach ($receipts as $receipt) {
            $items = json_decode($receipt->items, true);

            foreach ($items as $item) {
                $alreadyReviewed = DB::table('reviews')
                    ->where('user_id', $userId)
                    ->where('receipt_id', $receipt->transaction_id)
                    ->where('gear_id', $item['id'])
                    ->exists();

                if (!$alreadyReviewed) {
                    $gear = DB::table('gears')->select('main_image')->where('id', $item['id'])->first();

                    $unreviewed[] = [
                        'receipt_id'  => $receipt->transaction_id,
                        'gear_id'     => $item['id'],
                        'quantity'    => $item['quantity'],
                        'main_image'  => $gear?->main_image, // null nếu không tìm thấy
                    ];
                }
            }
        }

        return response()->json($unreviewed);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receipt_id' => 'required|string',
            'gear_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $userId = Auth::id();

        $exists = DB::table('reviews')
            ->where('user_id', $userId)
            ->where('receipt_id', $request->receipt_id)
            ->where('gear_id', $request->gear_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already reviewed this product in this order.'], 409);
        }

        DB::table('reviews')->insert([
            'user_id' => $userId,
            'receipt_id' => $request->receipt_id,
            'gear_id' => $request->gear_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Review submitted successfully.']);
    }
}
