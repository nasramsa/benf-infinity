<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Livraison extends Model
{
    protected $fillable = [
        'commande_id', 'adresse_id', 'transporteur',
        'numero_tracking', 'statut', 'estimated_at'
    ];

    protected $casts = [
        'estimated_at' => 'date',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function adresse(): BelongsTo
    {
        return $this->belongsTo(Adresse::class);
    }

    // Historique des étapes de suivi, du plus récent au plus ancien
    public function suivis(): HasMany
    {
        return $this->hasMany(SuiviLivraison::class)->orderByDesc('timestamp');
    }
}