<?php
namespace App\Mail;

use App\Models\Contact;
use App\Models\ContactReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactReplySent extends Mailable
{
    use Queueable, SerializesModels;

    public $contact;
    public $reply;

    public function __construct(Contact $contact, ContactReply $reply)
    {
        $this->contact = $contact;
        $this->reply = $reply;
    }

    public function build()
    {
        return $this->subject('Reply to Your Contact Request')
            ->view('emails.contact_reply');
    }
}
