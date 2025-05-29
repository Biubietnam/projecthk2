<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\AdoptionRequest;
use App\Models\AdoptionResponse;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdoptionRequestRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public AdoptionRequest $request,
        public AdoptionResponse $response
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Adoption Request Was Rejected',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.adoption.rejected',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
