<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\Commande;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    // GET /api/produits/{produitId}/avis
    // Public : retourne les avis approuvés d'un produit
    public function index(int $produitId)
    {
        $avis = Avis::where('produit_id', $produitId)
            ->where('approuve', true)
            ->with('client:id,nom,prenom')  // Seulement nom/prénom, pas l'email
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'note'         => $a->note,
                'commentaire'  => $a->commentaire,
                'created_at'   => $a->created_at->format('d/m/Y'),
                'client_nom'   => $a->client->prenom . ' ' . substr($a->client->nom, 0, 1) . '.',
            ]);

        return response()->json($avis);
    }

    // POST /api/avis
    // Client connecté — soumet un avis sur un produit qu'il a commandé
    public function store(Request $request)
    {
        $request->validate([
            'produit_id'  => 'required|exists:produits,id',
            'note'        => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        // Vérifier que le client a bien acheté ce produit
        // (anti-spam : on ne peut pas noter ce qu'on n'a pas commandé)
        $aAchete = Commande::where('client_id', $request->user()->id)
            ->where('statut', 'livree')
            ->whereHas('lignes.variante', fn($q) =>
                $q->where('produit_id', $request->produit_id)
            )
            ->exists();

        if (! $aAchete) {
            return response()->json([
                'message' => 'Vous devez avoir acheté ce produit pour laisser un avis.'
            ], 403);
        }

        // Un client = un avis par produit
        $dejaNote = Avis::where('client_id', $request->user()->id)
            ->where('produit_id', $request->produit_id)
            ->exists();

        if ($dejaNote) {
            return response()->json([
                'message' => 'Vous avez déjà laissé un avis sur ce produit.'
            ], 409);
        }

        $avis = Avis::create([
            'produit_id'  => $request->produit_id,
            'client_id'   => $request->user()->id,
            'note'        => $request->note,
            'commentaire' => $request->commentaire,
            'approuve'    => false, // En attente de modération dans Filament
        ]);

        return response()->json([
            'message' => 'Avis soumis. Il sera publié après modération.',
            'avis_id' => $avis->id,
        ], 201);
    }
}