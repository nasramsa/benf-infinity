<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Livraison;
use App\Models\SuiviLivraison;
use App\Http\Resources\LivraisonResource;
use Illuminate\Http\Request;

class LivraisonController extends Controller
{
    // GET /api/commandes/{id}/suivi
    // Retourne l'état de livraison d'une commande avec tout l'historique
    public function suivi(int $id)
    {
        // On vérifie que la commande appartient bien au client connecté
        $commande = Commande::where('id', $id)
            ->where('client_id', request()->user()->id)
            ->firstOrFail();

        $livraison = Livraison::where('commande_id', $commande->id)
            ->with(['suivis', 'adresse'])
            ->firstOrFail();

        return new LivraisonResource($livraison);
    }

    // PATCH /api/livraisons/{id}  (admin uniquement)
    // L'admin renseigne le transporteur, le tracking, et change le statut
    public function update(Request $request, int $id)
    {
        $request->validate([
            'transporteur'    => 'sometimes|string|max:100',
            'numero_tracking' => 'sometimes|string|max:100',
            'statut'          => 'sometimes|in:en_attente,en_cours,expediee,en_transit,livree',
            'estimated_at'    => 'sometimes|date',
        ]);

        $livraison = Livraison::findOrFail($id);
        $livraison->update($request->only([
            'transporteur', 'numero_tracking', 'statut', 'estimated_at'
        ]));

        // Chaque changement de statut crée une entrée dans l'historique
        if ($request->has('statut')) {
            SuiviLivraison::create([
                'livraison_id' => $livraison->id,
                'statut'       => $request->statut,
                'localisation' => $request->localisation ?? null,
                'message'      => $request->message ?? null,
                'timestamp'    => now(),
            ]);
        }

        return new LivraisonResource($livraison->load(['suivis', 'adresse']));
    }

    // POST /api/webhooks/livraison/tracking
    // Appelé par le transporteur (Canada Post, DHL…) quand le colis bouge
    // Route à ajouter dans routes/api.php sans middleware auth
    public function trackingWebhook(Request $request)
    {
        $numero = $request->input('tracking_number');

        $livraison = Livraison::where('numero_tracking', $numero)->first();

        if (! $livraison) {
            return response()->json(['message' => 'Tracking inconnu'], 404);
        }

        // Créer le suivi
        SuiviLivraison::create([
            'livraison_id' => $livraison->id,
            'statut'       => $request->input('statut'),
            'localisation' => $request->input('localisation'),
            'message'      => $request->input('message'),
            'timestamp'    => $request->input('timestamp') ?? now(),
        ]);

        // Mettre à jour le statut courant de la livraison
        $livraison->update(['statut' => $request->input('statut')]);

        // Si livré → mettre à jour la commande aussi
        if ($request->input('statut') === 'livree') {
            $livraison->commande->update(['statut' => 'livree']);
        }

        return response()->json(['status' => 'ok']);
    }
}