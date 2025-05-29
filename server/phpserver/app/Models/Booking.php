<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'pet_id',
        'service_id',
        'service_name',
        'date',
        'time_slot',
        'status',
        'notes',
    ];

    // Booking thuộc về một người dùng
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Booking thuộc về một thú cưng
    public function pet()
    {
        return $this->belongsTo(UserPet::class, 'pet_id');
    }

    // Booking liên kết với một dịch vụ
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
