<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Commande extends Model
{
    protected $fillable = [
        'client_id', 'statut', 'montant_total', 'numero', 'notes'
    ];

    protected $casts = [
        'montant_total' => 'decimal:2',
    ];

    // Génère le numéro lisible au moment de la création
    protected static function booted(): void
    {
        static::creating(function (Commande $commande) {
            $annee = now()->year;
            $dernier = static::whereYear('created_at', $annee)->count() + 1;
            $commande->numero = 'BNF-' . $annee . '-' . str_pad($dernier, 4, '0', STR_PAD_LEFT);
        });
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function paiement(): HasOne
    {
        return $this->hasOne(Paiement::class);
    }

    public function livraison(): HasOne
    {
        return $this->hasOne(Livraison::class);
    }
}