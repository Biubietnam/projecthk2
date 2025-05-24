<?php

namespace App\Mail;

use App\Models\AdoptionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdoptionRequestReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $adoption;

    public function __construct(AdoptionRequest $adoption)
    {
        $this->adoption = $adoption;
    }

    public function build()
    {
        return $this->subject('Adoption Request Submitted')
                    ->view('emails.adoption_request');
    }
}
