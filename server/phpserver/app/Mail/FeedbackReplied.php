<?php

namespace App\Mail;

use App\Models\FeedbackReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeedbackReplied extends Mailable
{
    use Queueable, SerializesModels;

    public $reply;

    public function __construct(FeedbackReply $reply)
    {
        $this->reply = $reply;
    }

    public function build()
    {
        return $this->subject('Your Feedback Received a Reply')
                    ->view('emails.feedback_reply');
    }
}

