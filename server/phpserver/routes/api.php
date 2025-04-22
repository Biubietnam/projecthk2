<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::post('/ask-ai', [AIController::class, 'ask']);
