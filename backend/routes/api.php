<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\PayPalController;
use App\Http\Controllers\Api\LivraisonController;
use App\Http\Controllers\Api\AvisController;

// -------------------------------------------------------
// SANTÉ — vérification que l'API tourne (Railway)
// -------------------------------------------------------
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// -------------------------------------------------------
// AUTHENTIFICATION — public
// -------------------------------------------------------
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/logout',   [AuthController::class, 'logout'])
        ->middleware('auth:sanctum');
});

// -------------------------------------------------------
// CATALOGUE — public (pas besoin d'être connecté)
// -------------------------------------------------------
Route::get('/produits',                    [ProduitController::class, 'index']);
Route::get('/produits/{slug}',             [ProduitController::class, 'show']);
Route::get('/produits/{produitId}/avis',   [AvisController::class, 'index']);

// -------------------------------------------------------
// ESPACE CLIENT — connecté via Sanctum
// -------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Commandes
    Route::post('/commandes',           [CommandeController::class, 'store']);
    Route::get('/commandes/{id}',       [CommandeController::class, 'show']);
    Route::get('/commandes/{id}/suivi', [LivraisonController::class, 'suivi']);

    // Avis
    Route::post('/avis', [AvisController::class, 'store']);

    // Paiement Stripe — crée le PaymentIntent, retourne client_secret
    Route::post('/paiements/stripe/intent', [PaiementController::class, 'createIntent']);

    // Paiement PayPal — crée l'order puis le capture après approbation
    Route::post('/paiements/paypal/create',        [PayPalController::class, 'createOrder']);
    Route::post('/paiements/paypal/capture/{id}',  [PayPalController::class, 'captureOrder']);
});

// -------------------------------------------------------
// ESPACE ADMIN — connecté + rôle admin
// À implémenter : middleware 'role:admin' ou utiliser Filament directement
// -------------------------------------------------------
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // Mise à jour manuelle d'une livraison (transporteur, tracking, statut)
    Route::patch('/livraisons/{id}', [LivraisonController::class, 'update']);
});

// -------------------------------------------------------
// WEBHOOKS — pas de middleware auth
// Stripe et PayPal signent leurs requêtes, on vérifie la signature dans le controller
// -------------------------------------------------------
Route::post('/webhooks/stripe',            [PaiementController::class,  'stripeWebhook']);
Route::post('/webhooks/paypal',            [PayPalController::class,    'webhook']);
Route::post('/webhooks/livraison/tracking',[LivraisonController::class, 'trackingWebhook']);