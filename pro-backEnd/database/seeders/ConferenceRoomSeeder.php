<?php
namespace Database\Seeders;

use App\Models\ConferenceRoom;
use Illuminate\Database\Seeder;

class ConferenceRoomSeeder extends Seeder
{
    public function run()
    {
        $rooms = [
            [
                'name' => 'Salle Alpha',
                'description' => 'Grande salle de conférence avec projecteur',
                'capacity' => 20,
                'equipment' => ['projecteur', 'wifi', 'tableau blanc', 'système audio']
            ],
            [
                'name' => 'Salle Beta',
                'description' => 'Salle de réunion moyenne',
                'capacity' => 10,
                'equipment' => ['écran TV', 'wifi', 'tableau blanc']
            ],
            [
                'name' => 'Salle Gamma',
                'description' => 'Petite salle pour réunions intimes',
                'capacity' => 6,
                'equipment' => ['wifi', 'tableau blanc']
            ]
        ];

        foreach ($rooms as $room) {
            ConferenceRoom::create($room);
        }
    }
}

