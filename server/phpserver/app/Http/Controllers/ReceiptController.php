<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;
use App\Models\Gear;
use Illuminate\Support\Facades\Validator;

class ReceiptController extends Controller
{
    public function getorders()
    {
        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $orders = Receipt::orderBy('transaction_id')->orderBy('transaction_id')->get();

        return response()->json($orders);
    }
    public function getall()
    {
        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $receipts = Receipt::where('user_id', $authUser->id)->orderBy('transaction_id')->get();
        return response()->json($receipts);
    }
    public function getorderbyid($transactionId)
    {
        $authUser = Auth::user();
        $roleId = $authUser->role_id ?? 0;
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        $receipt = Receipt::where('transaction_id', $transactionId)->first();
        if (!$receipt) {
            return response()->json(['error' => 'Receipt not found.'], 404);
        }
        if (!($roleId > 0 && $roleId <= 4) && $receipt->user_id !== $authUser->id) {
            return response()->json(['error' => 'Unauthorized access to this receipt.'], 403);
        }
        return response()->json($receipt);
    }


    public function usercancel($transactionId)
    {
        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $receipt = Receipt::where('transaction_id', $transactionId)->first();
        if (!$receipt) {
            return response()->json(['error' => 'Receipt not found.'], 404);
        }

        if ($receipt->user_id !== $authUser->id) {
            return response()->json(['error' => 'Unauthorized access to this receipt.'], 403);
        }

        if (in_array($receipt->shipping_status, ['CANCEL', 'REFUND', 'SHIPPED', 'SHIPPING'])) {
            return response()->json(['error' => 'Order already cancelled or refunded.'], 400);
        }
        if ($receipt->payment_status === 'paid') {
            return response()->json(['error' => 'Cannot cancel a paid order.'], 400);
        }
        $receipt->shipping_status = 'CANCEL';
        $receipt->save();

        return response()->json(['message' => 'Order cancelled successfully.']);
    }

    public function show($transactionId)
    {
        $receipt = Receipt::where('transaction_id', $transactionId)->firstOrFail();

        if ($receipt->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this receipt.');
        }

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
    public function updateOrderStatus(Request $request, $transactionId)
    {
        $authUser = Auth::user();
        $roleId = $authUser->role_id ?? 0;

        if (!($roleId > 0 && $roleId <= 4)) {
            return response()->json(['error' => 'Unauthorized access to this receipt.'], 403);
        }

        $receipt = Receipt::where('transaction_id', $transactionId)->first();
        if (!$receipt) {
            return response()->json(['error' => 'Receipt not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid email format.'], 422);
        }

        $currentStatus = $receipt->shipping_status;
        $newStatus = $request->input('shipping_status');

        if (!empty($newStatus) && $newStatus !== $currentStatus) {
            if (in_array($currentStatus, ['CANCEL', 'REFUND'])) {
                return response()->json(['error' => 'Cannot change status from CANCEL or REFUND.'], 400);
            }

            if (in_array($currentStatus, ['SHIPPED', 'SHIPPING']) && $newStatus === 'ORDERED') {
                return response()->json(['error' => 'Cannot change status to ORDERED from SHIPPED or SHIPPING.'], 400);
            }

            $receipt->shipping_status = $newStatus;
        }

        $receipt->number = $request->input('number', $receipt->number);
        $receipt->address = $request->input('address', $receipt->address);
        $receipt->email = $request->input('email', $receipt->email);

        $receipt->save();

        return response()->json(['message' => 'Order updated successfully.']);
    }
    public function cancelOrder($transactionId)
    {
        $authUser = Auth::user();
        $roleId = $authUser->role_id ?? 0;

        if (!($roleId > 0 && $roleId <= 4)) {
            return response()->json(['error' => 'Unauthorized access to this receipt.'], 403);
        }

        $receipt = Receipt::where('transaction_id', $transactionId)->first();
        if (!$receipt) {
            return response()->json(['error' => 'Receipt not found.'], 404);
        }

        if (in_array($receipt->shipping_status, ['CANCEL', 'REFUND', 'SHIPPED', 'SHIPPING'])) {
            return response()->json(['error' => 'Order already cancelled or refunded.'], 400);
        }

        $receipt->shipping_status = 'CANCEL';
        $receipt->save();

        return response()->json(['message' => 'Order cancelled successfully.']);
    }
}
