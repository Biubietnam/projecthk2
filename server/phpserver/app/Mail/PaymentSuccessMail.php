<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Receipt;

class PaymentSuccessMail extends Mailable
{
    use Queueable, SerializesModels;

    public $receipt;

    public function __construct(Receipt $receipt)
    {
        $receipt->items = json_decode(json_encode($receipt->items), true);
        $this->receipt = $receipt;
    }


    public function build()
    {
        return $this->subject('🎉 Payment Successful – Your PetZone Order')
            ->view('emails.payment_success');
    }
}
