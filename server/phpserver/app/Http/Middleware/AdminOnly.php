<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Kiểm tra nếu user không phải admin thì trả về lỗi 403.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user()?->load('role');

        if (! $user || $user->role->name !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
