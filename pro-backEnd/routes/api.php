<?php

use App\Http\Controllers\Api\ConferenceRoomController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Routes pour les salles de conférence
    Route::apiResource('conference-rooms', ConferenceRoomController::class);
    Route::post('conference-rooms/{conferenceRoom}/check-availability', 
        [ConferenceRoomController::class, 'checkAvailability']);

    // Routes pour les réservations
    Route::apiResource('reservations', ReservationController::class);
    Route::patch('reservations/{reservation}/confirm', 
        [ReservationController::class, 'confirm']);
});
