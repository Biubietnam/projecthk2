<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\Role;

class SocialLoginController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->view('oauth-popup', [
                'message' => 'Authentication failed.',
            ], 401);
        }

        $email = $socialUser->getEmail();

        if (! $email) {
            return response()->view('oauth-popup', [
                'message' => 'No email received from ' . ucfirst($provider),
            ], 400);
        }

        $role = Role::where('name', 'user')->firstOrFail();

        $user = User::withTrashed()->where('email', $email)->first();

        if ($user && $user->trashed()) {
            return response()->view('oauth-popup', [
                'message' => 'This account has been deactivated.',
            ], 403);
        }

        if (! $user) {
            $user = User::create([
                'email'    => $email,
                'name'     => $socialUser->getName() ?? $socialUser->getNickname(),
                'password' => bcrypt(Str::random(16)),
                'role_id'  => $role->id,
            ]);
        }

        $user->load('role');

        $token = $user->createToken("{$provider}-login")->plainTextToken;

        return response()->view('oauth-popup', [
            'message'      => 'Login successful',
            'token'        => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }
}
