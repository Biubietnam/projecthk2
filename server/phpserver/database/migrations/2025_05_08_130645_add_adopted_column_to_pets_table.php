<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->boolean('adopted')->default(false)->after('careGrooming');
        });
    }
    
    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn('adopted');
        });
    }    
};
