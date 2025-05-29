<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;
use App\Models\Gear;

class ReceiptController extends Controller
{
    public function show($transactionId)
    {
        $receipt = Receipt::where('transaction_id', $transactionId)->firstOrFail();

        if ($receipt->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this receipt.');
        }

        // Retrieve full item info for each item in the receipt
        $detailedItems = collect($receipt->items)->map(function ($item) {
            $gear = Gear::find($item['id']);
            if (!$gear) return null;

            return [
                'id'    => $gear->id,
                'name'  => $gear->name,
                'price' => $gear->price,
                'quantity' => $item['quantity']
            ];
        })->filter()->values();

        return response()->json([
            'orderId'       => $receipt->transaction_id,
            'date'          => $receipt->date_issued->toDateString(),
            'paymentMethod' => $receipt->payment_status === 'paid' ? 'Credit Card' : 'Cash on Delivery',
            'total'         => $receipt->amount,
            'items'         => $detailedItems,
            'customer'      => [
                'name'  => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
            'shopInfo'      => [
                'name'    => 'Pet Shop',
                'address' => '123 Pet Street, Animalville',
                'phone'   => '(555) 123-4567',
                'email'   => 'info@pawsomepets.com',
            ],
        ]);
    }
}