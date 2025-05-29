<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\AdoptionRequest;
use App\Models\AdoptionResponse;

class AdoptionRequestApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public AdoptionRequest $request,
        public AdoptionResponse $response
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Adoption Request Was Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.adoption.approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
