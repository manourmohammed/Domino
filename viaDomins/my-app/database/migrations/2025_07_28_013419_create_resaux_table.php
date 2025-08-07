<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('resaux', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domaine_id')->constrained('domaines')->onDelete('cascade');

            $table->string('ping')->nullable();
            $table->string('http_status')->nullable();
            $table->date('ssl_expiration')->nullable();
            $table->string('adress_ip')->nullable();
            $table->string('server_location')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resaux');
    }
};
