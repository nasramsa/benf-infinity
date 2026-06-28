<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Variante;
use App\Models\Stock;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Catégorie T-shirts
        $cat = Categorie::create([
            'nom' => 'T-Shirts',
            'slug' => 't-shirts',
            'description' => 'T-shirts premium Benf-Infinity',
        ]);

        // Produit exemple
        $produit = Produit::create([
            'categorie_id' => $cat->id,
            'nom' => 'T-Shirt Infinity Classic',
            'slug' => 't-shirt-infinity-classic',
            'description' => 'Le t-shirt signature Benf-Infinity, coupe moderne, coton bio 200g.',
            'prix_base' => 49.99,
            'actif' => true,
        ]);

        // Variantes : tailles × couleurs
        $tailles = ['S', 'M', 'L', 'XL'];
        $couleurs = ['Noir', 'Blanc'];

        foreach ($couleurs as $couleur) {
            foreach ($tailles as $taille) {
                $variante = Variante::create([
                    'produit_id' => $produit->id,
                    'sku' => 'TSHIRT-' . strtoupper(substr($couleur, 0, 3)) . '-' . $taille,
                    'taille' => $taille,
                    'couleur' => $couleur,
                    'prix' => 49.99,
                ]);

                // Stock initial pour chaque variante
                Stock::create([
                    'variante_id' => $variante->id,
                    'quantite' => 20,
                    'seuil_alerte' => 5,
                ]);
            }
        }
    }
}