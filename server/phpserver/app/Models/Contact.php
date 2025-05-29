<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'subject',
        'message'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getSubjectOptions()
    {
        return [
            'General Inquiry',
            'Technical Issue',
            'Custom Request',
            'Emergency',
            'Others'
        ];
    }

    public function reply()
    {
        return $this->hasOne(ContactReply::class);
    }

    
}
