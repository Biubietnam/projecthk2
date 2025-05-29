<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\FeedbackReply;

class Feedback extends Model
{
    protected $table = 'feedbacks';
    protected $fillable = [
        'name',
        'email',
        'message',
    ];

    public function reply()
    {
        return $this->hasOne(FeedbackReply::class);
    }
}
