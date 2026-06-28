<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'      => $this->id,
            'methode' => $this->methode,
            'statut'  => $this->statut,
            'montant' => $this->montant,
            'devise'  => $this->devise,
            'paid_at' => $this->paid_at?->format('d/m/Y H:i'),
            // Ne jamais exposer stripe_payment_id ou paypal_order_id au frontend
        ];
    }
}