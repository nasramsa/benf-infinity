<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProduitResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'nom'         => $this->nom,
            'slug'        => $this->slug,
            'description' => $this->description,
            'prix_base'   => $this->prix_base,
            // Charge les variantes et médias seulement si déjà eager-loaded
            'variantes'   => VarianteResource::collection($this->whenLoaded('variantes')),
            'medias'      => $this->whenLoaded('medias', fn() =>
                $this->medias->map(fn($m) => [
                    'url'       => asset('storage/' . $m->url),
                    'principale' => $m->principale,
                    'ordre'     => $m->ordre,
                ])
            ),
            'note_moyenne' => $this->whenLoaded('avis',
                fn() => round($this->avis->avg('note'), 1)
            ),
        ];
    }
}