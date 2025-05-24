<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'service_name',
        'duration_minutes',
    ];

    // Một dịch vụ có thể có nhiều lượt đặt lịch
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
