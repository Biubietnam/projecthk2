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
        'image',
        'careDiet',
        'careExercise',
        'careGrooming',
    ];
    
    protected $casts = [
        'tags' => 'array',
    ];
}
