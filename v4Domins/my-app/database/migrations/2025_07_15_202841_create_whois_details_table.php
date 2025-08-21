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
        Schema::create('whois_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domaine_id')->constrained('domaines')->onDelete('cascade');
            $table->date('date_creation')->nullable();
            $table->string('registrar')->nullable();
            $table->text('dns')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whois_details');
    }
};
