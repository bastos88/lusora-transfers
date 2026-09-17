<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{CatalogController,AuthController,BookingController,LocationController};
Route::middleware('throttle:120,1')->group(function() {
    foreach(['vehicles','services','testimonials','faqs'] as $path) Route::get($path,[CatalogController::class,$path]);
    Route::get('locations',LocationController::class)->middleware('throttle:30,1');
    Route::post('quotes',[BookingController::class,'quote'])->middleware('throttle:30,1');
    Route::middleware(['web','throttle:6,1'])->group(function() {
        Route::post('register',[AuthController::class,'register']);
        Route::post('login',[AuthController::class,'login']);
        Route::post('forgot-password',[AuthController::class,'forgot']);
        Route::post('reset-password',[AuthController::class,'reset']);
    });
    Route::middleware(['web','auth:sanctum'])->group(function() {
        Route::get('user',[AuthController::class,'me']);
        Route::patch('user',[AuthController::class,'profile']);
        Route::post('logout',[AuthController::class,'logout']);
        Route::get('bookings',[BookingController::class,'index']);
        Route::post('bookings',[BookingController::class,'store']);
        Route::get('bookings/{booking}',[BookingController::class,'show']);
        Route::post('bookings/{booking}/cancel',[BookingController::class,'cancel']);
    });
});
