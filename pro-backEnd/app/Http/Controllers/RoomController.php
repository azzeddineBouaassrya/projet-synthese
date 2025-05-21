<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoomController extends Controller
{
    public function index()
    {
        return Room::all();
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'capacity' => 'required|integer',
            'equipment' => 'nullable|string'
        ]);
        
        return Room::create($validated);
    }
    
    // Autres méthodes (show, update, destroy)
}

