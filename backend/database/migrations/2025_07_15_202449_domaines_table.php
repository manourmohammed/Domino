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
            $table->string('statut')->nullable();
            $table->date('date_expiration')->nullable();
            $table->string('cms')->nullable();
            $table->decimal('availability', 5, 2)->nullable(); // 0.00 to 100.00
            $table->decimal('response_time', 8, 3)->nullable(); // ms or seconds
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
