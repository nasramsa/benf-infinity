<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    protected $table = 'mouvements_stock';

    protected $fillable = [
        'variante_id', 'type', 'quantite', 'raison', 'commande_id'
    ];

    protected $casts = [
        'quantite' => 'integer',
    ];

    public function variante(): BelongsTo
    {
        return $this->belongsTo(Variante::class);
    }

    // Relation optionnelle vers la commande qui a déclenché le mouvement
    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }
}