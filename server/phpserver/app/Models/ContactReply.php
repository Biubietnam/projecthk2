<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactReply extends Model
{
    protected $fillable = [
        'contact_id',
        'responder_id',
        'message',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function responder()
    {
        return $this->belongsTo(User::class, 'responder_id');
    }
}
