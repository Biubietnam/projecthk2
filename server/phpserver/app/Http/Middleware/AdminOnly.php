<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user()?->load('role');

        if (! $user || ! in_array($user->role->name, ['admin', 'staff'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
