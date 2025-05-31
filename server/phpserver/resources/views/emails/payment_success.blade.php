<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Successful</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="background: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #10B981;">🎉 Thank you for your order, {{ $receipt->full_name }}!</h2>
        <p>Your payment of <strong>${{ number_format($receipt->amount, 2) }}</strong> has been received successfully.</p>

        <h3>🧾 Transaction Details</h3>
        <ul>
            <li><strong>Transaction ID:</strong> {{ $receipt->transaction_id }}</li>
            <li><strong>Payment Status:</strong> Paid</li>
            <li><strong>Shipping Address:</strong> {{ $receipt->address }}</li>
        </ul>

        <h3>🛍️ Order Summary</h3>
        <table width="100%" style="border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f1f1f1;">
                    <th style="text-align: left; padding: 8px;">Product</th>
                    <th style="text-align: center; padding: 8px;">Qty</th>
                    <th style="text-align: right; padding: 8px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($receipt->items as $item)
                <tr>
                    <td style="padding: 8px;">{{ $item['name'] }}</td>
                    <td style="text-align: center; padding: 8px;">{{ $item['quantity'] }}</td>
                    <td style="text-align: right; padding: 8px;">${{ number_format($item['subtotal'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <h3 style="color: #10B981;">✅ Total Paid: ${{ number_format($receipt->amount, 2) }}</h3>

        <p style="margin-top: 30px;">You can track your order by visiting our website.</p>

        <p>Thanks again for shopping with <strong>PetZone</strong> 🐾</p>

        <p style="margin-top: 40px;">
            Warm regards,<br>
            The PetZone Team<br>
            📧 support@petzone.com<br>
            📞 +1 (800) 123-4567
        </p>
    </div>
</body>
</html>
