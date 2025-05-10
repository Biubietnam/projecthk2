<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'gear_id',
        'quantity',
        'price',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function gear()
    {
        return $this->belongsTo(Gear::class);
    }

    public function getTotalPriceAttribute()
    {
        return $this->quantity * $this->price;
    }
}
