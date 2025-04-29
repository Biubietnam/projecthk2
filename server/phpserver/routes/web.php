<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialLoginController;


Route::get('/auth/{provider}/redirect', [SocialLoginController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialLoginController::class, 'callback']);
