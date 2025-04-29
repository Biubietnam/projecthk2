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
        $socialUser = Socialite::driver($provider)->stateless()->user();

        $role = Role::where('name', 'user')->firstOrFail();
    
        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'password' => bcrypt(Str::random(16)),
                'role_id' => $role->id,
            ]
        );

        $user->load('role');
    
        $token = $user->createToken('google-login')->plainTextToken;
    
        return response()->view('oauth-popup', [
            'message'      => 'Login successful',
            'token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }
    
    
}
