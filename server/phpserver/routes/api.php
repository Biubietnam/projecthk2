<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisterController,
    LoginController,
    ForgotPasswordController,
    ResetPasswordController,
    VerificationController,
    ProfileController
};
use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\GearController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Authentication Routes
|--------------------------------------------------------------------------
|
| Các route đăng ký, đăng nhập, quên mật khẩu… trả về JSON cho React.
|
*/

Route::get('/pets/{id}', [PetController::class, 'show']);

Route::get('/pets', [PetController::class, 'index']);

Route::get('/gears', [GearController::class, 'index']);

Route::get('/gears/{id}', [GearController::class, 'show']);

Route::get('/gears/{gear}/reviews', [ReviewController::class, 'index']);

Route::post('/gears/{id}/review', [ReviewController::class, 'store']);

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

Route::middleware(['auth:sanctum', 'admin'])->get('/admin/users', function () {
    return User::with('role')->get();
});

Route::middleware(['auth:sanctum', 'admin'])->delete('/admin/users/{id}', function ($id) {
    return User::findOrFail($id)->delete();
});
