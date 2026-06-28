<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avis extends Model
{
    protected $table = 'avis';

    protected $fillable = [
        'produit_id', 'client_id', 'note', 'commentaire', 'approuve'
    ];

    protected $casts = [
        'note'     => 'integer',
        'approuve' => 'boolean',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}