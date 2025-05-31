<!DOCTYPE html>
<html>
<body>
    <h2>Hi {{ $feedback->name }},</h2>
    <p>Thank you for your feedback!</p>
    <p><strong>Your message:</strong></p>
    <blockquote>{{ $feedback->message }}</blockquote>
    <p>We appreciate your thoughts and will get back to you if needed.</p>
    <br>
    <p>Best regards,<br>PetZone Support Team</p>
</body>
</html>
