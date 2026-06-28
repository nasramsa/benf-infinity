<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuiviLivraison extends Model
{
    protected $table = 'suivi_livraisons';

    protected $fillable = [
        'livraison_id', 'statut', 'localisation', 'message', 'timestamp'
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public function livraison(): BelongsTo
    {
        return $this->belongsTo(Livraison::class);
    }
}