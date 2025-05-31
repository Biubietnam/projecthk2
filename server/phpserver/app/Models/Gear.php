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
        'images',
        'main_image',
        'highlights',
        'details',
        'shipping_info',
        'return_policy',
        'stock',
        'rating',
        'reviews_count',
        'is_featured',
        'is_new',
        'sale_percent',
    ];

    protected $casts = [
        'highlights' => 'array',
        'images' => 'array',
    ];

    public function getFinalPriceAttribute()
    {
        return round($this->price * (1 - $this->sale_percent / 100), 2);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
