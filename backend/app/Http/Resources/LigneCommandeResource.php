<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LigneCommandeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'quantite'      => $this->quantite,
            // Prix figé au moment de l'achat — ne pas relire depuis Variante
            'prix_unitaire' => $this->prix_unitaire,
            'sous_total'    => $this->sous_total,
            'variante'      => $this->whenLoaded('variante', fn() => [
                'id'      => $this->variante->id,
                'sku'     => $this->variante->sku,
                'taille'  => $this->variante->taille,
                'couleur' => $this->variante->couleur,
                // Nom du produit parent pour l'affichage dans le récap
                'produit_nom' => $this->variante->produit?->nom,
                'image_url'   => $this->variante->produit
                    ?->medias
                    ?->firstWhere('principale', true)
                    ?->url,
            ]),
        ];
    }
}