<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdoptionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pet_id',
        'status',
        'note',
        'requested_at',
        'approved_at',
        'scheduled_at',
        'rejected_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function response()
    {
        return $this->hasOne(AdoptionResponse::class, 'adoption_request_id');
    }
}
