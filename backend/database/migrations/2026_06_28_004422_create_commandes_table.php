<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_commandes_table.php
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients');
            // Statuts : en_attente → confirmée → en_preparation → expédiée → livrée | annulée
            $table->enum('statut', [
                'en_attente', 'confirmee', 'en_preparation',
                'expediee', 'livree', 'annulee'
            ])->default('en_attente');
            $table->decimal('montant_total', 10, 2);
            // Numéro lisible affiché au client (ex: BNF-2024-0042)
            $table->string('numero')->unique();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
