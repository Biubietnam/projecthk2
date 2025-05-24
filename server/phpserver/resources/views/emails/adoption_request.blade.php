<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Adoption Request Confirmation</title>
</head>
<body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); overflow: hidden;">
        <tr>
            <td style="padding: 32px;">
                <h2 style="margin: 0 0 20px; font-size: 24px; color: #2f855a;">🐶 Adoption Request Submitted</h2>

                <p style="font-size: 16px; margin: 0 0 16px;">
                    Hello <strong>{{ $adoption->user->name }}</strong>,
                </p>

                <p style="font-size: 16px; margin: 0 0 16px;">
                    Thank you for submitting an adoption request for <strong style="color: #d69e2e;">{{ $adoption->pet->name }}</strong>. We’ve received your request and will process it as soon as possible.
                </p>

                @if($adoption->note)
                <p style="font-size: 15px; color: #4a5568; margin: 16px 0;">
                    <strong>Your Note:</strong> "{{ $adoption->note }}"
                </p>
                @endif

                <p style="font-size: 14px; color: #718096; margin: 0 0 24px;">
                    Submitted on: {{ \Carbon\Carbon::parse($adoption->requested_at)->format('F j, Y - H:i') }}
                </p>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="{{ url('/my-adoptions') }}"
                       style="display: inline-block; background-color: #2b6cb0; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                        View My Requests
                    </a>
                </div>

                <p style="font-size: 14px; color: #4a5568; margin-top: 24px;">
                    We’ll notify you once your request is approved or rejected. If you have any questions, feel free to contact us.
                </p>
            </td>
        </tr>

        <tr>
            <td style="background-color: #edf2f7; padding: 16px; text-align: center; font-size: 12px; color: #a0aec0;">
                © {{ now()->year }} PetZone. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>
