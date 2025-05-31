<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Thanks for contacting PetZone</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 32px; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #4F46E5;">🐾 Thank you for reaching out, {{ $contact['full_name'] }}!</h2>

        <p style="font-size: 15px;">We’ve received your message:</p>

        <blockquote style="background-color: #f3f4f6; padding: 12px 16px; border-left: 4px solid #4F46E5; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0; font-style: italic;">{{ $contact['message'] }}</p>
        </blockquote>

        <p style="font-size: 14px; color: #4b5563;">Subject: <strong>{{ $contact['subject'] }}</strong></p>
        <p style="font-size: 14px;">📧 We will get back to you as soon as possible.</p>

        <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">— The PetZone Team</p>
    </div>
</body>
</html>
