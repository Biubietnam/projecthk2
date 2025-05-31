<h2>Hello {{ $reply->feedback->name }},</h2>

<p>Thank you for your feedback. Our team has responded:</p>

<blockquote style="color: #555; border-left: 4px solid #ccc; padding-left: 10px;">
    {{ $reply->message }}
</blockquote>

<p>Best regards,<br>PetZone Team</p>
