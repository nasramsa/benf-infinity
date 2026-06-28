<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    protected $fillable = [
        'commande_id', 'stripe_payment_id', 'paypal_order_id',
        'methode', 'statut', 'montant', 'devise', 'paid_at'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    // Helper : est-ce que ce paiement est confirmé ?
    public function estPaye(): bool
    {
        return $this->statut === 'paye';
    }
}