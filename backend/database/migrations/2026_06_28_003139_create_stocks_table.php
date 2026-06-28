<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_stocks_table.php
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            // Relation 1-1 avec Variante
            $table->foreignId('variante_id')->unique()->constrained('variantes')->cascadeOnDelete();
            $table->integer('quantite')->default(0);
            // Alerte si quantite <= seuil_alerte (ex: 5)
            $table->integer('seuil_alerte')->default(5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
