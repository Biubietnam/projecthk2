<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisterController,
    LoginController,
    ForgotPasswordController,
    ResetPasswordController,
    VerificationController,
};
use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\GearController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdoptionRequestController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;

Route::get('/pets/{id}', [PetController::class, 'show']);

Route::get('/pets', [PetController::class, 'index']);

Route::get('/gears', [GearController::class, 'index']);

Route::get('/gears/{id}', [GearController::class, 'show']);

Route::get('/gears/{gear}/reviews', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/gears/{id}/review', [ReviewController::class, 'store']);
});

Route::post('register', [RegisterController::class, 'register']);

Route::post('login',    [LoginController::class, 'login']);

Route::post('forgot',   [ForgotPasswordController::class, 'forgot']);

Route::post('reset',    [ResetPasswordController::class, 'reset']);

Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:3000/reset/{$token}");
})->middleware('guest')->name('password.reset');

Route::get('verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware(['signed']);

Route::post('email/resend', [VerificationController::class, 'resend'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [LoginController::class, 'logout']);

    Route::get('user',   [ProfileController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'admin'])->get('/admin/users', function () {
    return User::with('role')->get();
});

Route::middleware(['auth:sanctum', 'admin'])->delete('/admin/users/{id}', function ($id) {
    return User::findOrFail($id)->delete();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/adoption-requests', [AdoptionRequestController::class, 'index']);
    Route::post('/adoption-requests', [AdoptionRequestController::class, 'store']);
    Route::patch('/adoption-requests/{id}/approve', [AdoptionRequestController::class, 'approve']);
    Route::patch('/adoption-requests/{id}/reject', [AdoptionRequestController::class, 'reject']);
    Route::delete('/adoption-requests/{id}', [AdoptionRequestController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/add/{gearId}', [CartController::class, 'add']);
    Route::put('/cart/update/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{itemId}', [CartController::class, 'remove']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});


