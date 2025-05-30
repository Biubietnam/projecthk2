<?php

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
        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $items = $request->input('items', []);
        if (!is_array($items) || empty($items)) {
            return response()->json(['error' => 'No items provided.'], 422);
        }

        $gearMap = Gear::whereIn('id', collect($items)->pluck('id'))->get()->keyBy('id');

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

        $totalDollars = $lineItems->sum('subtotal');


        $fullName = $request->input('customer.fullName');
        $email    = $request->input('customer.email');
        $phone    = $request->input('customer.phone');
        $address  = $request->input('customer.address');

        $country = strtoupper($request->input('customer.country', 'VN'));
        if (!in_array($country, ['VN', 'US', 'SG'])) {
            return response()->json(['error' => 'Invalid country.'], 422);
        }

        $count = Receipt::count() + 1;
        $txnId = $country . str_pad($count, 6, '0', STR_PAD_LEFT);


        Receipt::create([
            'transaction_id' => $txnId,
            'user_id'        => $authUser->id,
            'items'          => $lineItems->toArray(),
            'amount'         => $totalDollars,
            'payment_status' => 'cash',
            'full_name'      => $fullName,
            'email'          => $email,
            'number'         => $phone,
            'address'        => $address,
        ]);

        return response()->json([
            'success'        => true,
            'transaction_id' => $txnId,
        ], 201);
    }

    public function createPaymentIntent(Request $request)
    {

        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

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
        $gearMap = Gear::whereIn('id', collect($items)->pluck('id'))->get()->keyBy('id');
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

        $country = strtoupper($request->input('customer.country', 'VN'));
if (!in_array($country, ['VN', 'US', 'SG'])) {
            return response()->json(['error' => 'Invalid country.'], 422);
        }

        $count = Receipt::count() + 1;
        $txnId = $country . str_pad($count, 6, '0', STR_PAD_LEFT);

        $paidAmount   = $pi->amount_received / 100;
        $emailRaw = $customerMeta['email'] ?? null;


        if (is_array($emailRaw)) {
            $email = $emailRaw[0] ?? '';
        } else {
            $email = (string) $emailRaw;
        }

        Receipt::create([
            'transaction_id' => $txnId,
            'user_id'        => $authUser?->id,
            'items'          => $lineItems->toArray(),
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
            'email'          => $emailRaw,
        ]);
    }
}