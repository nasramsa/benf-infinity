<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_paiements_table.php
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->unique()->constrained('commandes')->cascadeOnDelete();
            // stripe_payment_id OU paypal_order_id selon la méthode
            $table->string('stripe_payment_id')->nullable();
            $table->string('paypal_order_id')->nullable();
            // methode : stripe_card | stripe_apple_pay | stripe_google_pay | paypal
            $table->string('methode');
            // statut : en_attente | payé | échoué | remboursé
            $table->enum('statut', ['en_attente', 'paye', 'echoue', 'rembourse'])->default('en_attente');
            $table->decimal('montant', 10, 2);
            $table->string('devise', 3)->default('CAD');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
