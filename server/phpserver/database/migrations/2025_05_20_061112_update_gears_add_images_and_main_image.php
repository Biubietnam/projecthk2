<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->dropColumn('image');
            $table->json('images')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->dropColumn('images');
            $table->string('image')->nullable();
        });
    }
};
