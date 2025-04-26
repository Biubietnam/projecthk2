<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisterController,
    LoginController,
    ForgotPasswordController,
    ResetPasswordController,
    VerificationController,
    ProfileController
};

/*
|--------------------------------------------------------------------------
| API Authentication Routes
|--------------------------------------------------------------------------
|
| Các route đăng ký, đăng nhập, quên mật khẩu… trả về JSON cho React.
|
*/

// Đăng ký
Route::post('register', [RegisterController::class, 'register']);

// Đăng nhập
Route::post('login',    [LoginController::class, 'login']);

// Quên mật khẩu: gửi link reset
Route::post('forgot',   [ForgotPasswordController::class, 'forgot']);

// Reset mật khẩu
Route::post('reset',    [ResetPasswordController::class, 'reset']);

Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:3000/reset/{$token}");
})->middleware('guest')->name('password.reset');

// Xác thực email (link trong email)
Route::get('verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware(['signed']);

// Gửi lại link xác thực (cần token)
Route::post('email/resend', [VerificationController::class, 'resend'])
     ->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Các route cần token (auth:sanctum)
|--------------------------------------------------------------------------
|
| Logout, lấy thông tin user, v.v…
|
*/
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('logout', [LoginController::class, 'logout']);

    // Lấy info user hiện tại
    Route::get('user',   [ProfileController::class, 'me']);
});
