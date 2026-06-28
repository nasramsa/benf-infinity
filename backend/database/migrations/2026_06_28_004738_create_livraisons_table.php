<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_livraisons_table.php
    public function up(): void
    {
        Schema::create('livraisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->unique()->constrained('commandes')->cascadeOnDelete();
            $table->foreignId('adresse_id')->constrained('adresses');
            $table->string('transporteur')->nullable();   // Canada Post, Purolator, DHL…
            $table->string('numero_tracking')->nullable();
            // statut : en_attente | en_cours | expediee | en_transit | livree
            $table->enum('statut', [
                'en_attente', 'en_cours', 'expediee', 'en_transit', 'livree'
            ])->default('en_attente');
            $table->date('estimated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};
