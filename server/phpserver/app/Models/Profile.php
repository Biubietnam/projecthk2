<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'gender',
        'date_of_birth',
        'phone',
        'address',
        'city',
        'country',
        'avatar_url',
    ];

    protected $casts = [
        'avatar_url' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

