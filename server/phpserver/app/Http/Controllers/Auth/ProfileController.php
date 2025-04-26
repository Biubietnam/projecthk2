<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        // Trả về thông tin user đang auth
        return response()->json($request->user());
    }
}
