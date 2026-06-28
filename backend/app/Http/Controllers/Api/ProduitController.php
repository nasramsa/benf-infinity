<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Http\Resources\ProduitResource;

class ProduitController extends Controller
{
    // GET /api/produits — liste avec filtre par catégorie
    public function index()
    {
        $produits = Produit::where('actif', true)
            ->with(['medias' => fn($q) => $q->where('principale', true)])
            ->get();

        return ProduitResource::collection($produits);
    }

    // GET /api/produits/{slug} — détail complet
    public function show(string $slug)
    {
        $produit = Produit::where('slug', $slug)
            ->where('actif', true)
            ->with(['variantes.stock', 'medias', 'avis'])
            ->firstOrFail();

        return new ProduitResource($produit);
    }
}