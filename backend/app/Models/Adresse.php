<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Adresse extends Model
{
    protected $fillable = [
        'client_id', 'rue', 'ville', 'province',
        'code_postal', 'pays', 'par_defaut'
    ];

    protected $casts = [
        'par_defaut' => 'boolean',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Une adresse peut être liée à plusieurs livraisons
    public function livraisons(): HasMany
    {
        return $this->hasMany(Livraison::class);
    }
}