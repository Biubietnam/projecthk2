<?php
// app/Http/Controllers/StripeController.php

namespace App\Http\Controllers;

use App\Models\Gear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Receipt;
use Stripe\Stripe;
use Stripe\PaymentIntent;


class StripeController extends Controller
{

    public function createCashOrder(Request $request)
    {
        $items = $request->input('items', []);
        if (!is_array($items) || empty($items)) {
            return response()->json(['error' => 'No items provided.'], 422);
        }
        $gearMap = Gear::whereIn('id', collect($items)->pluck('id'))->get()
            ->keyBy('id');
        $lineItems = collect($items)
            ->map(function ($i) use ($gearMap) {
                $gear = $gearMap->get($i['id']);
                if (!$gear) return null;
                $qty = max(0, (int)$i['quantity']);
                return [
                    'id'       => $gear->id,
                    'name'     => $gear->name,
                    'unit'     => $gear->price,
                    'quantity' => $qty,
                    'subtotal' => $gear->price * $qty,
                ];
            })
            ->filter();
        if ($lineItems->isEmpty()) {
            return response()->json(['error' => 'No valid items found.'], 422);
            $dollars = $lineItems->sum('subtotal');
            $amount  = round($dollars * 100);
            $customer  = $request->input('customer');
        }
    }
    public function createPaymentIntent(Request $request)
    {


        Stripe::setApiKey(config('services.stripe.secret'));
        $items = $request->input('items', []);
        if (!is_array($items) || empty($items)) {
            return response()->json(['error' => 'No items provided.'], 422);
        }
        $gearMap = Gear::whereIn('id', collect($items)->pluck('id'))->get()
            ->keyBy('id');
        $lineItems = collect($items)
            ->map(function ($i) use ($gearMap) {
                $gear = $gearMap->get($i['id']);
                if (!$gear) return null;
                $qty = max(0, (int)$i['quantity']);
                return [
                    'id'       => $gear->id,
                    'name'     => $gear->name,
                    'unit'     => $gear->price,
                    'quantity' => $qty,
                    'subtotal' => $gear->price * $qty,
                ];
            })
            ->filter();
        if ($lineItems->isEmpty()) {
            return response()->json(['error' => 'No valid items found.'], 422);
        }

        $dollars = $lineItems->sum('subtotal');
        $amount  = round($dollars * 100);
        $customer  = $request->input('customer');
        $paymentIntent = PaymentIntent::create([
            'amount'               => $amount,
            'currency'             => 'usd',
            'payment_method_types' => ['card'],
            'metadata'             => [
                'customer' => json_encode($customer),
            ],
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }



    public function confirmPayment(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $piId  = $request->input('payment_intent_id');
        $items = $request->input('items');

        $pi = PaymentIntent::retrieve($piId);

        if ($pi->status !== 'succeeded') {
            return response()->json(['error' => 'Payment not successful.'], 400);
        }

        $customerMeta = json_decode($pi->metadata->customer ?? '{}', true);

        $authUser = Auth::user();

        $fullName = $customerMeta['fullName'];
        $email    = $customerMeta['email'];
        $number   = $customerMeta['phone'];
        $address  = $customerMeta['address'];

        $count        = Receipt::count() + 1;
        $txnId        = 'VN' . str_pad($count, 6, '0', STR_PAD_LEFT);
        $paidAmount   = $pi->amount_received / 100;


        Receipt::create([
            'transaction_id' => $txnId,
            'user_id'        => $authUser?->id,
            'items'          => $items,
            'amount'         => $paidAmount,
            'payment_status' => 'paid',
            'full_name'      => $fullName,
            'email'          => $email,
            'number'         => $number,
            'address'        => $address,
        ]);

        return response()->json([
            'success'        => true,
            'transaction_id' => $txnId,
        ]);
    }
}
