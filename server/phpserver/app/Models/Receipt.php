<?php
// app/Models/Receipt.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $table = 'receipt';

    // We rely on MySQL default timestamp for date_issued
    public $timestamps = false;

    protected $fillable = [
        'transaction_id',
        'user_id',
        'items',
        'amount',
        'payment_status',
        'shipping_status',
        'address',
        'number',
        'email',
        'full_name',
    ];

    protected $casts = [
        'items'           => 'array',
        'amount'          => 'float',
        'payment_status'  => 'string',
        'shipping_status' => 'string',
        'date_issued'     => 'datetime',
        'address'         => 'string',
        'number'          => 'string',
        'email'           => 'string',
        'full_name'       => 'string',
    ];

}