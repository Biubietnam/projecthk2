<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['gear_id', 'user_id', 'rating', 'comment'];

    public function gear()
    {
        return $this->belongsTo(Gear::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
