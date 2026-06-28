<?php

namespace App\Mail;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CommandeConfirmee extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Commande $commande)
    {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Confirmation de commande #{$this->commande->numero} — Benf-Infinity",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.commande.confirmee',
        );
    }
}