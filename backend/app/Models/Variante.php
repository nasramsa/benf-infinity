<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Variante extends Model
{
    protected $fillable = [
        'produit_id', 'sku', 'taille', 'couleur', 'prix'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    // Relation 1-1 : chaque variante a exactement un stock
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }

    public function mouvementsStock(): HasMany
    {
        return $this->hasMany(MouvementStock::class);
    }
}