<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response($this->renderVerificationResult('Invalid or expired link', false));
        }

        if ($user->hasVerifiedEmail()) {
            return response($this->renderVerificationResult('Email already verified', true));
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response($this->renderVerificationResult('Email verified successfully', true));
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent']);
    }

    protected function renderVerificationResult($message, $success = true)
    {
        $color = $success ? 'green' : 'red';
        $title = $success ? 'Success' : 'Failed';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    window.onload = function () {
        let seconds = 10;
        const countdownEl = document.getElementById('countdown');
        const interval = setInterval(() => {
            seconds--;
        if (seconds > 0) {
            countdownEl.textContent = "Redirecting in " + seconds + " seconds...";
        } else {
            clearInterval(interval);
            window.close();
        }
    }, 1000);
};

</script>

</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-md text-center">
    <h1 class="text-2xl  text-{$color}-600 mb-4">{$title}</h1>
    <p class="text-gray-700 mb-6">{$message}</p>
    <p id="countdown" class="text-gray-500">Redirecting in 10 seconds...</p>
  </div>
</body>
</html>
HTML;
    }
}
