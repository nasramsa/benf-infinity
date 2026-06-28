<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VarianteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'      => $this->id,
            'sku'     => $this->sku,
            'taille'  => $this->taille,
            'couleur' => $this->couleur,
            'prix'    => $this->prix,
            'stock'   => $this->whenLoaded('stock', fn() => [
                'quantite'     => $this->stock->quantite,
                'disponible'   => $this->stock->quantite > 0,
            ]),
        ];
    }
}