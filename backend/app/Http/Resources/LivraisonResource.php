<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LivraisonResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'transporteur'     => $this->transporteur,
            'numero_tracking'  => $this->numero_tracking,
            'statut'           => $this->statut,
            'estimated_at'     => $this->estimated_at?->format('d/m/Y'),
            // Historique des étapes, du plus récent au plus ancien
            'suivis' => $this->whenLoaded('suivis', fn() =>
                $this->suivis->map(fn($s) => [
                    'statut'      => $s->statut,
                    'localisation'=> $s->localisation,
                    'message'     => $s->message,
                    'timestamp'   => $s->timestamp->format('d/m/Y H:i'),
                ])
            ),
            'adresse' => $this->whenLoaded('adresse', fn() => [
                'rue'         => $this->adresse->rue,
                'ville'       => $this->adresse->ville,
                'province'    => $this->adresse->province,
                'code_postal' => $this->adresse->code_postal,
                'pays'        => $this->adresse->pays,
            ]),
        ];
    }
}