<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $fillable = [
        'categorie_id', 'nom', 'slug', 'description', 'prix_base', 'actif'
    ];

    protected $casts = [
        'actif' => 'boolean',
        'prix_base' => 'decimal:2',
    ];

    // Un produit appartient à une catégorie
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    // Un produit a plusieurs variantes (taille/couleur)
    public function variantes(): HasMany
    {
        return $this->hasMany(Variante::class);
    }

    // Un produit a plusieurs médias (photos)
    public function medias(): HasMany
    {
        return $this->hasMany(Media::class)->orderBy('ordre');
    }

    // Raccourci : photo principale uniquement
    public function mediaPrincipale(): HasMany
    {
        return $this->hasMany(Media::class)->where('principale', true);
    }

    // Avis approuvés du produit
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class)->where('approuve', true);
    }
}