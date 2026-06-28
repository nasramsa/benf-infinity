<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Variante;
use App\Models\MouvementStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    // POST /api/commandes
    // Body : { adresse_id, lignes: [{ variante_id, quantite }] }
    public function store(Request $request)
    {
        $request->validate([
            'adresse_id'           => 'required|exists:adresses,id',
            'lignes'               => 'required|array|min:1',
            'lignes.*.variante_id' => 'required|exists:variantes,id',
            'lignes.*.quantite'    => 'required|integer|min:1',
        ]);

        // Toute la logique dans une transaction :
        // si une étape échoue, tout est annulé (atomicité)
        return DB::transaction(function () use ($request) {
            $montantTotal = 0;
            $lignesData   = [];

            foreach ($request->lignes as $ligne) {
                $variante = Variante::with('stock')->findOrFail($ligne['variante_id']);

                // Vérification du stock
                if ($variante->stock->quantite < $ligne['quantite']) {
                    return response()->json([
                        'message' => "Stock insuffisant pour la variante {$variante->sku}",
                    ], 422);
                }

                $sousTotal      = $variante->prix * $ligne['quantite'];
                $montantTotal  += $sousTotal;

                $lignesData[] = [
                    'variante'    => $variante,
                    'quantite'    => $ligne['quantite'],
                    'prix_unitaire' => $variante->prix,  // Snapshot du prix
                    'sous_total'  => $sousTotal,
                ];
            }

            // Créer la commande
            $commande = Commande::create([
                'client_id'    => $request->user()->id,
                'statut'       => 'en_attente',
                'montant_total' => $montantTotal,
            ]);

            // Créer les lignes et décrémenter les stocks
            foreach ($lignesData as $ld) {
                LigneCommande::create([
                    'commande_id'   => $commande->id,
                    'variante_id'   => $ld['variante']->id,
                    'quantite'      => $ld['quantite'],
                    'prix_unitaire' => $ld['prix_unitaire'],
                    'sous_total'    => $ld['sous_total'],
                ]);

                // Décrémenter le stock
                $ld['variante']->stock->decrement('quantite', $ld['quantite']);

                // Tracer le mouvement
                MouvementStock::create([
                    'variante_id' => $ld['variante']->id,
                    'type'        => 'vente',
                    'quantite'    => -$ld['quantite'],
                    'raison'      => "Commande #{$commande->numero}",
                    'commande_id' => $commande->id,
                ]);
            }

            // Créer la livraison vide (l'admin la remplira)
            $commande->livraison()->create([
                'adresse_id' => $request->adresse_id,
                'statut'     => 'en_attente',
            ]);

            return response()->json([
                'commande_id'   => $commande->id,
                'numero'        => $commande->numero,
                'montant_total' => $commande->montant_total,
            ], 201);
        });
    }

    // GET /api/commandes/{id}
    public function show(int $id)
    {
        $commande = Commande::where('id', $id)
            ->where('client_id', request()->user()->id)
            ->with([
                'lignes.variante.produit.medias',  // pour récupérer l'image dans LigneCommandeResource
                'paiement',
                'livraison.suivis',
                'livraison.adresse',
                'client',
            ])
            ->firstOrFail();

        return new CommandeResource($commande);  // ← utiliser la Resource, pas json() brut
    }
}