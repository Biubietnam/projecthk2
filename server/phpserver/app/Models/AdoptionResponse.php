<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdoptionResponse extends Model
{
    protected $fillable = [
        'adoption_request_id',
        'responder_id',
        'action',
        'note',
        'responded_at',
    ];

    public function request()
    {
        return $this->belongsTo(AdoptionRequest::class, 'adoption_request_id');
    }

    public function responder()
    {
        return $this->belongsTo(User::class, 'responder_id');
    }
}
