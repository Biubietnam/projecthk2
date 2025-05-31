<!DOCTYPE html>
<html>
<body>
    <p>Hi {{ $contact->full_name }},</p>
    <p>We’ve responded to your message:</p>
    <blockquote>{{ $contact->message }}</blockquote>
    <hr>
    <p><strong>Reply:</strong></p>
    <p>{{ $reply->message }}</p>
    <p>Best regards,<br>Your Support Team</p>
</body>
</html>
