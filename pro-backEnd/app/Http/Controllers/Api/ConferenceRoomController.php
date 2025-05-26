<?php
namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\ConferenceRoom;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ConferenceRoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = ConferenceRoom::where('is_active', true)
            ->with(['reservations' => function ($query) {
                $query->where('status', '!=', 'cancelled')
                      ->where('end_time', '>=', now());
            }])
            ->get();

        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'equipment' => 'nullable|array'
        ]);

        $room = ConferenceRoom::create($request->all());

        return response()->json($room, 201);
    }

    public function show(ConferenceRoom $conferenceRoom): JsonResponse
    {
        $conferenceRoom->load(['reservations' => function ($query) {
            $query->where('status', '!=', 'cancelled')
                  ->with('user:id,name,email');
        }]);

        return response()->json($conferenceRoom);
    }

    public function update(Request $request, ConferenceRoom $conferenceRoom): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'equipment' => 'nullable|array'
        ]);

        $conferenceRoom->update($request->all());

        return response()->json($conferenceRoom);
    }

    public function destroy(ConferenceRoom $conferenceRoom): JsonResponse
    {
        $conferenceRoom->update(['is_active' => false]);

        return response()->json(['message' => 'Salle désactivée avec succès']);
    }

    // Vérifier la disponibilité d'une salle
    public function checkAvailability(Request $request, ConferenceRoom $conferenceRoom): JsonResponse
    {
        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $hasConflict = Reservation::hasConflict(
            $conferenceRoom->id,
            $request->start_time,
            $request->end_time
        );

        return response()->json([
            'available' => !$hasConflict,
            'room' => $conferenceRoom
        ]);
    }
}