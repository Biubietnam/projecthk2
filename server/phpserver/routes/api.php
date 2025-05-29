<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisterController,
    LoginController,
    ForgotPasswordController,
    ResetPasswordController,
    VerificationController,
};
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\GearController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdoptionRequestController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserPetController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\BookingController;

Route::get('/pets/{id}', [PetController::class, 'show']);
Route::get('/pets', [PetController::class, 'index']);

Route::get('/gears', [GearController::class, 'index']);
Route::get('/gears/{id}', [GearController::class, 'show']);
Route::get('/gears/{gear}/reviews', [ReviewController::class, 'index']);


Route::post('register', [RegisterController::class, 'register']);
Route::post('login',    [LoginController::class, 'login']);
Route::post('forgot',   [ForgotPasswordController::class, 'forgot']);
Route::post('reset',    [ResetPasswordController::class, 'reset']);

Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:1/reset/{$token}");
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

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin', function () {
        $user = Auth::user();
        $roleId = $user->role_id ?? 0;

        if ($roleId > 0 && $roleId <= 4) {
            return response()->json(['role_id' => $roleId]);
        }

        // otherwise 401 Unauthorized
        return response()->json(['error' => 'Unauthorized'], 401);
    });
    Route::get('/admin/users', function () {
        return User::with('role')->get();
    });
    Route::get('/admin/users/{id}', function ($id) {
        return User::with('role')->findOrFail($id);
    });
    Route::delete('/admin/users/{id}', function ($id) {
        return User::findOrFail($id)->delete();
    });
    Route::get('/admin/users/{id}/profile', [ProfileController::class, 'show']);

    Route::post('/admin/pets', [PetController::class, 'store']);
    Route::put('/admin/pets/{id}', [PetController::class, 'update']);
    Route::delete('/admin/pets/{id}', [PetController::class, 'destroy']);
    Route::put('/admin/gears/{id}', [GearController::class, 'update']);
    Route::post('/admin/gears', [GearController::class, 'store']);
    Route::delete('/admin/gears/{id}', [GearController::class, 'destroy']);
    Route::get('/admin/orders', [ReceiptController::class, 'getorders']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/adoption-requests', [AdoptionRequestController::class, 'index']);
    Route::post('/adoption-requests', [AdoptionRequestController::class, 'store']);
    Route::patch('/adoption-requests/{id}/approve', [AdoptionRequestController::class, 'approve']);
    Route::patch('/adoption-requests/{id}/reject', [AdoptionRequestController::class, 'reject']);
    Route::delete('/adoption-requests/{id}', [AdoptionRequestController::class, 'destroy']);
    Route::get('/adoption/check/{pet}', [AdoptionRequestController::class, 'check']);

    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/add/{gearId}', [CartController::class, 'add']);
    Route::put('/cart/update/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{itemId}', [CartController::class, 'remove']);

    Route::post('/vnpay/create-payment', [PaymentController::class, 'createPayment']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});
// Dat Part: UserPetController

//Hiển thi day đủ thông tin cua dat lich
Route::get('/user/{id}/bookings', [BookingController::class, 'showUserBookings']);
Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
Route::get('/booked-time-slots', [BookingController::class, 'getBookedTimeSlots']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/booked-slots', [BookingController::class, 'getBookedSlots']);
//Hien thi day du thong tin cua pet
Route::delete('/pets/{id}', [UserPetController::class, 'destroy']);
Route::get('/user/{id}/userpets', [UserPetController::class, 'getUserPets']);
Route::post('/userpets', [UserPetController::class, 'store']);
Route::put('/userpets/{id}', [UserPetController::class, 'update']);


Route::get('/vnpay/return', [PaymentController::class, 'vnpayReturn']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post("/create-order", [StripeController::class, 'createCashOrder']);
    Route::post('/confirm-payment', [StripeController::class, 'confirmPayment']);
    Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('receipts/{transaction}', [ReceiptController::class, 'show']);
});
