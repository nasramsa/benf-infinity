<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Paiement;
use App\Mail\CommandeConfirmee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class PaiementController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // POST /api/paiements/stripe/intent
    // Retourne le client_secret pour que le frontend monte Stripe Elements
    public function createIntent(Request $request)
    {
        $request->validate(['commande_id' => 'required|exists:commandes,id']);

        $commande = Commande::where('id', $request->commande_id)
            ->where('client_id', $request->user()->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        // Stripe travaille en centimes
        $montantCentimes = (int) round($commande->montant_total * 100);

        $intent = PaymentIntent::create([
            'amount'   => $montantCentimes,
            'currency' => 'cad',
            // Active automatiquement Apple Pay et Google Pay
            // si le navigateur/appareil les supporte
            'payment_method_types' => ['card'],
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => [
                'commande_id' => $commande->id,
                'numero'      => $commande->numero,
            ],
        ]);

        // Créer l'enregistrement Paiement en base (statut = en_attente)
        Paiement::create([
            'commande_id'       => $commande->id,
            'stripe_payment_id' => $intent->id,
            'methode'           => 'stripe',
            'statut'            => 'en_attente',
            'montant'           => $commande->montant_total,
            'devise'            => 'CAD',
        ]);

        return response()->json(['client_secret' => $intent->client_secret]);
    }

    // POST /api/webhooks/stripe
    // Stripe appelle cette route directement — PAS de middleware auth
    public function stripeWebhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            // Si la signature est invalide, on rejette (fausse requête)
            Log::error('Stripe webhook signature invalide', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Signature invalide'], 400);
        }

        // Traiter uniquement les événements qui nous intéressent
        match ($event->type) {
            'payment_intent.succeeded' => $this->handlePaymentSucceeded($event->data->object),
            'payment_intent.payment_failed' => $this->handlePaymentFailed($event->data->object),
            default => null,
        };

        return response()->json(['status' => 'ok']);
    }

    private function handlePaymentSucceeded($paymentIntent): void
    {
        $paiement = Paiement::where('stripe_payment_id', $paymentIntent->id)->first();
        if (! $paiement) return;

        $paiement->update([
            'statut'  => 'paye',
            'methode' => $paymentIntent->payment_method_types[0] ?? 'stripe',
            'paid_at' => now(),
        ]);

        $commande = $paiement->commande;
        $commande->update(['statut' => 'confirmee']);

        // Envoyer l'email de confirmation au client
        Mail::to($commande->client->email)
            ->send(new CommandeConfirmee($commande));
    }

    private function handlePaymentFailed($paymentIntent): void
    {
        $paiement = Paiement::where('stripe_payment_id', $paymentIntent->id)->first();
        $paiement?->update(['statut' => 'echoue']);
    }
}