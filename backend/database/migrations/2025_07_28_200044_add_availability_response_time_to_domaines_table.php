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
        Schema::table('domaines', function (Blueprint $table) {
            $table->decimal('availability', 5, 2)->default(100)->after('cms');
            $table->integer('response_time')->default(0)->after('availability');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            //
        });
    }
};
