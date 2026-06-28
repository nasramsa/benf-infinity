<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_mouvements_stock_table.php
    public function up(): void
    {
        Schema::create('mouvements_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variante_id')->constrained('variantes')->cascadeOnDelete();
            // Type : vente | retour | ajout_manuel | ajustement
            $table->enum('type', ['vente', 'retour', 'ajout_manuel', 'ajustement']);
            // Positif = entrée, négatif = sortie
            $table->integer('quantite');
            $table->string('raison')->nullable();
            // Référence optionnelle à la commande qui a déclenché le mouvement
            $table->unsignedBigInteger('commande_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mouvements_stock');
    }
};
