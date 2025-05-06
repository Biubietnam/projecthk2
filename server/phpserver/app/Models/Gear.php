<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gear extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'petType',
        'category',
        'image',
        'highlights',
        'details',
        'shipping_info',
        'return_policy',
        'stock',
        'rating',
        'reviews_count',
        'is_featured',
    ];

    protected $casts = [
        'highlights' => 'array',
        'stock' => 'integer',
        'rating' => 'float',
        'reviews_count' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
