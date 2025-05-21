<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BookingController extends Controller
{
    public function index()
    {
        if (auth()->user()->isAdmin()) {
            return Booking::with(['user', 'room'])->get();
        }
        
        return auth()->user()->bookings()->with('room')->get();
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'purpose' => 'required|string'
        ]);
        
        $room = Room::find($validated['room_id']);
        
        if (!$room->isAvailable($validated['start_time'], $validated['end_time'])) {
            return response()->json(['error' => 'La salle n\'est pas disponible pour ce créneau'], 400);
        }
        
        $booking = auth()->user()->bookings()->create([
            'room_id' => $validated['room_id'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'purpose' => $validated['purpose'],
            'status' => 'pending'
        ]);
        
        return response()->json($booking, 201);
    }
    
    // Autres méthodes (update, destroy)
}
