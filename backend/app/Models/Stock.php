<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $fillable = ['variante_id', 'quantite', 'seuil_alerte'];

    public function variante(): BelongsTo
    {
        return $this->belongsTo(Variante::class);
    }

    // Helper : est-ce que le stock est au niveau d'alerte ?
    public function estEnAlerte(): bool
    {
        return $this->quantite <= $this->seuil_alerte;
    }
}