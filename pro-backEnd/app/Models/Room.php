<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['name', 'description', 'capacity', 'equipment'];
    
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    
    public function isAvailable($startTime, $endTime)
    {
        return !$this->bookings()
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime]);
            })
            ->where('status', '!=', 'cancelled')
            ->exists();
    }
}
