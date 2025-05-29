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
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\UserPetController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactReplyController;
use App\Http\Controllers\FeedbackReplyController;
use App\Http\Controllers\FavoritePetController;

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
    return redirect("http://localhost:3000/reset/{$token}");
})->middleware('guest')->name('password.reset');

Route::get('verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware(['signed']);

Route::post('email/resend', [VerificationController::class, 'resend'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [LoginController::class, 'logout']);

    Route::get('user/{id}/profile',   [ProfileController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', function () {
        return User::with('role')->get();
    });
    Route::get('/admin/users/{id}', function ($id) {
        return User::with('role')->findOrFail($id);
    });
    Route::delete('/admin/users/{id}', function ($id) {
        return User::findOrFail($id)->delete();
    });
    Route::put('/admin/users/{id}', function ($id) {
        $user = User::findOrFail($id);
        $user->update(request()->all());
        return $user->load('role');
    });

    Route::get('/admin/users/{id}/profile', [ProfileController::class, 'show']);
    Route::put('/admin/users/{id}/profile', [ProfileController::class, 'update']);

    Route::post('/admin/pets', [PetController::class, 'store']);
    Route::put('/admin/pets/{id}', [PetController::class, 'update']);
    Route::delete('/admin/pets/{id}', [PetController::class, 'destroy']);
    Route::put('/admin/gears/{id}', [GearController::class, 'update']);
    Route::post('/admin/gears', [GearController::class, 'store']);
    Route::delete('/admin/gears/{id}', [GearController::class, 'destroy']);

    Route::get('/admin/feedbacks', [FeedbackController::class, 'index']);
    Route::get('/admin/feedbacks/{id}', [FeedbackController::class, 'show']);
    Route::put('/admin/feedbacks/{id}', [FeedbackController::class, 'update']);
    Route::delete('/admin/feedbacks/{id}', [FeedbackController::class, 'destroy']);

    Route::get('/adoption-requests', [AdoptionRequestController::class, 'index']);
    Route::post('/adoption-requests', [AdoptionRequestController::class, 'store']);
    Route::patch('/adoption-requests/{id}/approve', [AdoptionRequestController::class, 'approve']);
    Route::patch('/adoption-requests/{id}/reject', [AdoptionRequestController::class, 'reject']);
    Route::delete('/adoption-requests/{id}', [AdoptionRequestController::class, 'destroy']);
    Route::get('/adoption/check/{pet}', [AdoptionRequestController::class, 'check']);

    Route::get('/admin/contacts', [ContactController::class, 'index']);
    Route::get('/admin/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/admin/contacts/{id}', [ContactController::class, 'update']);
    Route::delete('/admin/contacts/{id}', [ContactController::class, 'destroy']);

    Route::get('/admin/contacts/{id}/replies', [ContactReplyController::class, 'index']);
    Route::post('/admin/contacts/{id}/replies', [ContactReplyController::class, 'store']);
    Route::delete('/admin/contacts/replies/{id}', [ContactReplyController::class, 'destroy']);

    Route::get('/admin/feedbacks/{id}/replies', [FeedbackReplyController::class, 'index']);
    Route::post('/admin/feedbacks/{id}/replies', [FeedbackReplyController::class, 'store']);
    Route::delete('/admin/feedbacks/replies/{id}', [FeedbackReplyController::class, 'destroy']);
});

Route::post('/feedback', [FeedbackController::class, 'store']);
Route::post('/contacts', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/add/{gearId}', [CartController::class, 'add']);
    Route::put('/cart/update/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{itemId}', [CartController::class, 'remove']);

    Route::post('/favorite/{petId}', [FavoritePetController::class, 'toggle']);
    Route::get('/favorite/{petId}', [FavoritePetController::class, 'check']);
    Route::get('/favorites', [FavoritePetController::class, 'list']);

    Route::post('/vnpay/create-payment', [PaymentController::class, 'createPayment']);


    Route::get('/user/{id}/profile', [ProfileController::class, 'show']);
    Route::put('/user/{id}/profile', [ProfileController::class, 'update']);
});

// Dat Part: UserPetController
// Lấy ID của người dùng và trả về danh sách thú cưng của người dùng đó
Route::get('/user/{id}/userpets', [UserPetController::class, 'getUserPets']);
Route::get('/booked-time-slots', [BookingController::class, 'getBookedTimeSlots']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/booked-slots', [BookingController::class, 'getBookedSlots']);

Route::get('/vnpay/return', [PaymentController::class, 'vnpayReturn']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/confirm-payment', [StripeController::class, 'confirmPayment']);
    Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('receipts/{transaction}', [ReceiptController::class, 'show']);
});
