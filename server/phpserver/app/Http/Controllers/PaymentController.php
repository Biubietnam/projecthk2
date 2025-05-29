<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $user = $request->user();

        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = env('VNPAY_URL');
        $vnp_Returnurl = env('VNPAY_RETURN_URL');

        $vnp_TxnRef = uniqid();
        $vnp_OrderInfo = "Checkout for user #{$user->id}";
        $vnp_Amount = (int) $request->amount;

        $inputData = [
            'vnp_Version' => '2.1.0',
            'vnp_TmnCode' => $vnp_TmnCode,
            'vnp_Amount' => $vnp_Amount,
            'vnp_Command' => 'pay',
            'vnp_CreateDate' => now()->format('YmdHis'),
            'vnp_CurrCode' => 'VND',
            'vnp_IpAddr' => $request->ip() ?? '127.0.0.1',
            'vnp_Locale' => 'vn',
            'vnp_OrderInfo' => $vnp_OrderInfo,
            'vnp_OrderType' => 'billpayment',
            'vnp_ReturnURL' => $vnp_Returnurl,
            'vnp_TxnRef' => $vnp_TxnRef,
        ];

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $vnp_SecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $paymentUrl = $vnp_Url . '?' . $hashData . '&vnp_SecureHash=' . $vnp_SecureHash;

        return response()->json(['payment_url' => $paymentUrl]);
    }

    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';

        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);
        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $generatedHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($vnp_SecureHash === $generatedHash) {
            return response()->json([
                'message' => 'Checkout successful!',
                'order_code' => $inputData['vnp_TxnRef'] ?? null,
                'amount' => $inputData['vnp_Amount'] / 100 ?? 0
            ]);
        } else {
            return response()->json(['message' => 'Sai chữ ký xác thực!'], 400);
        }
    }
}
