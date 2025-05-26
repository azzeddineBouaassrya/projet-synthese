<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with(['conferenceRoom', 'user:id,name,email']);

        // Filtres pour les utilisateurs (leurs propres réservations)
        if (!auth()->user()->is_admin) {
            $query->where('user_id', auth()->id());
        }

        // Filtre par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtre par date
        if ($request->has('date')) {
            $query->whereDate('start_time', $request->date);
        }

        $reservations = $query->orderBy('start_time', 'desc')->get();

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'conference_room_id' => 'required|exists:conference_rooms,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Vérifier les conflits
        if (Reservation::hasConflict(
            $request->conference_room_id,
            $request->start_time,
            $request->end_time
        )) {
            return response()->json([
                'message' => 'La salle n\'est pas disponible pour cette période'
            ], 422);
        }

        $reservation = Reservation::create([
            'conference_room_id' => $request->conference_room_id,
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => 'pending'
        ]);

        $reservation->load(['conferenceRoom', 'user:id,name,email']);

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        // Vérifier les permissions
        if (!auth()->user()->is_admin && $reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->load(['conferenceRoom', 'user:id,name,email']);

        return response()->json($reservation);
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        // Vérifier les permissions
        if (!auth()->user()->is_admin && $reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'date|after:now',
            'end_time' => 'date|after:start_time',
        ]);

        // Vérifier les conflits si les heures changent
        if ($request->has('start_time') || $request->has('end_time')) {
            $startTime = $request->start_time ?? $reservation->start_time;
            $endTime = $request->end_time ?? $reservation->end_time;

            if (Reservation::hasConflict(
                $reservation->conference_room_id,
                $startTime,
                $endTime,
                $reservation->id
            )) {
                return response()->json([
                    'message' => 'La salle n\'est pas disponible pour cette période'
                ], 422);
            }
        }

        $reservation->update($request->all());
        $reservation->load(['conferenceRoom', 'user:id,name,email']);

        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        // Vérifier les permissions
        if (!auth()->user()->is_admin && $reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Réservation annulée avec succès']);
    }

    // Confirmer une réservation (admin seulement)
    public function confirm(Reservation $reservation): JsonResponse
    {
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->update(['status' => 'confirmed']);
        $reservation->load(['conferenceRoom', 'user:id,name,email']);

        return response()->json($reservation);
    }
}