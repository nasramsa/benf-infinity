<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommandeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'numero'        => $this->numero,
            'statut'        => $this->statut,
            'montant_total' => $this->montant_total,
            'notes'         => $this->notes,
            'created_at'    => $this->created_at->format('d/m/Y H:i'),

            // Chargé seulement si eager-loaded (->with('lignes'))
            'lignes'    => LigneCommandeResource::collection(
                $this->whenLoaded('lignes')
            ),
            'paiement'  => new PaiementResource($this->whenLoaded('paiement')),
            'livraison' => new LivraisonResource($this->whenLoaded('livraison')),
            'client'    => new ClientResource($this->whenLoaded('client')),
        ];
    }
}