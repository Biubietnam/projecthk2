<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use SoftDeletes;
    
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
        'main_image',
        'careDiet',
        'careExercise',
        'careGrooming',
        'adopted',
    ];

    protected $casts = [
        'tags' => 'array',
        'images' => 'array',
    ];

    public function adoptionRequests()
    {
        return $this->hasMany(AdoptionRequest::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(User::class, 'favorite_pets')->withTimestamps();
    }
}
