<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('domaines', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->boolean('en_ligne')->default(false);
            $table->string('statut')->nullable(); // Valide / Expiré / Bientôt
            $table->date('date_expiration')->nullable();
            $table->string('cms')->nullable(); // WordPress, Joomla, etc.
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
