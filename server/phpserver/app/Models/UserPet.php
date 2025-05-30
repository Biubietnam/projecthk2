<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'breed', 'age', 'gender', 'species', 'weight_kg', 'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'pet_id');
    }
}
