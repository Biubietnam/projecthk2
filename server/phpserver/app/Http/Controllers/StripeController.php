<?php
// app/Http/Controllers/StripeController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Receipt;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;


class StripeController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        Log::info('Stripe secret is: ' . config('services.stripe.secret'));
        $amount = $request->input('amount');

        $paymentIntent = PaymentIntent::create([
            'amount'               => $amount,
            'currency'             => 'usd',
            'payment_method_types' => ['card'],
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
            return response()->json([
                'error' => 'Payment not successful.',
            ], 400);
        }

        $count = Receipt::count() + 1;
        $txnId = 'VN' . str_pad($count, 6, '0', STR_PAD_LEFT);

        // amount_received is in cents; convert to dollars (or your currency unit)
        $paidAmount = $pi->amount_received / 100;

        Receipt::create([
            'transaction_id'  => $txnId,
            'user_id'         => Auth::id(),
            'items'           => $items,
            'amount'          => $paidAmount,
            'payment_status'  => 'paid',
        ]);

        return response()->json([
            'success'        => true,
            'transaction_id' => $txnId,
        ]);
    }
}