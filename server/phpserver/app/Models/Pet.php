<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'name',
        'breed',
        'age',
        'type',
        'description',
        'gender',
        'weight',
        'color',
        'tags',
        'adoptionFee',
        'images',
        'careDiet',
        'careExercise',
        'careGrooming',
    ];

    protected $casts = [
        'tags' => 'array',
        'images' => 'array',
    ];

    public function adoptionRequests()
    {
        return $this->hasMany(AdoptionRequest::class);
    }
}
