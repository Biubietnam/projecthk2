<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Adoption Request Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333;">

    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); overflow: hidden;">
                    <tr>
                        <td style="padding: 32px;">

                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #2f855a; line-height: 1.4;">
                                🐾 Hello {{ $adoption->user->name }},
                            </h2>

                            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                                We’ve received your adoption request for <strong style="color: #d69e2e;">{{ $adoption->pet->name }}</strong>. We're reviewing it and will get back to you shortly.
                            </p>

                            @if($adoption->note)
                                <p style="font-size: 15px; line-height: 1.6; color: #4a5568; background-color: #fefcbf; padding: 10px 14px; border-radius: 8px; margin: 20px 0;">
                                    <strong>📝 Your Note:</strong><br> {{ $adoption->note }}
                                </p>
                            @endif

                            @if($adoption->pet->image)
                                <img src="{{ asset('storage/' . $adoption->pet->image) }}"
                                     alt="Photo of {{ $adoption->pet->name }}"
                                     style="width: 100%; max-width: 100%; border-radius: 8px; margin: 24px 0;" />
                            @endif

                            <p style="font-size: 14px; color: #718096; margin: 0 0 24px;">
                                Submitted on: {{ \Carbon\Carbon::parse($adoption->requested_at)->format('F j, Y - H:i') }}
                            </p>

                            <div style="text-align: center; margin: 32px 0;">
                                <a href="{{ url('http://localhost:3000') }}"
                                   style="display: inline-block; background-color: #2b6cb0; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500;">
                                    View PetZone
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #4a5568;">
                                You’ll receive another email once your request is approved or rejected. For any questions, feel free to <a href="{{ url('/http://localhost:3000/contact') }}" style="color: #2b6cb0; text-decoration: underline;">contact us</a>.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#edf2f7" style="padding: 16px; text-align: center; font-size: 12px; color: #a0aec0;">
                            © {{ now()->year }} PetZone. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
