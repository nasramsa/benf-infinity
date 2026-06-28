<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Paiement;
use App\Mail\CommandeConfirmee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PayPalController extends Controller
{
    private string $baseUrl;

    public function __construct()
    {
        // Sandbox pour les tests, live pour la production
        $this->baseUrl = config('services.paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    // Récupère un access token OAuth PayPal
    private function getAccessToken(): string
    {
        $response = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret')
        )->asForm()->post("{$this->baseUrl}/v1/oauth2/token", [
            'grant_type' => 'client_credentials',
        ]);

        return $response->json('access_token');
    }

    // POST /api/paiements/paypal/create
    public function createOrder(Request $request)
    {
        $request->validate(['commande_id' => 'required|exists:commandes,id']);

        $commande = Commande::where('id', $request->commande_id)
            ->where('client_id', $request->user()->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post("{$this->baseUrl}/v2/checkout/orders", [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'reference_id' => (string) $commande->id,
                    'description'  => "Commande Benf-Infinity #{$commande->numero}",
                    'amount' => [
                        'currency_code' => 'CAD',
                        'value'         => number_format($commande->montant_total, 2, '.', ''),
                    ],
                ]],
                // Redirection PayPal (pour les navigateurs sans JS — fallback)
                'application_context' => [
                    'return_url' => config('app.frontend_url') . '/paiement/succes',
                    'cancel_url' => config('app.frontend_url') . '/paiement/annule',
                    'brand_name' => 'Benf-Infinity',
                    'user_action' => 'PAY_NOW',
                ],
            ]);

        $order = $response->json();

        // Enregistrer le paiement en attente
        Paiement::create([
            'commande_id'     => $commande->id,
            'paypal_order_id' => $order['id'],
            'methode'         => 'paypal',
            'statut'          => 'en_attente',
            'montant'         => $commande->montant_total,
            'devise'          => 'CAD',
        ]);

        return response()->json(['paypal_order_id' => $order['id']]);
    }

    // POST /api/paiements/paypal/capture/{paypalOrderId}
    // Appelé par le frontend après approbation du client
    public function captureOrder(Request $request, string $paypalOrderId)
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture");

        $capture = $response->json();

        if ($capture['status'] !== 'COMPLETED') {
            return response()->json(['message' => 'Paiement PayPal non complété.'], 400);
        }

        $paiement = Paiement::where('paypal_order_id', $paypalOrderId)->firstOrFail();
        $paiement->update([
            'statut'  => 'paye',
            'paid_at' => now(),
        ]);

        $commande = $paiement->commande;
        $commande->update(['statut' => 'confirmee']);

        Mail::to($commande->client->email)
            ->send(new CommandeConfirmee($commande));

        return response()->json(['message' => 'Paiement confirmé.', 'commande_id' => $commande->id]);
    }

    // POST /api/webhooks/paypal (optionnel — sécurité renforcée)
    public function webhook(Request $request)
    {
        // En production : vérifier la signature PayPal ici
        // Doc : https://developer.paypal.com/docs/api-basics/notifications/webhooks/
        $event = $request->json()->all();
        Log::info('PayPal webhook', ['type' => $event['event_type'] ?? 'unknown']);

        return response()->json(['status' => 'ok']);
    }
}