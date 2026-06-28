<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'      => $this->id,
            'nom'     => $this->nom,
            'prenom'  => $this->prenom,
            'email'   => $this->email,
            'telephone' => $this->telephone,
            // Jamais de password, jamais de remember_token
        ];
    }
}