<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->boolean('is_new')->default(false)->after('details');
            $table->tinyInteger('sale_percent')->default(0)->after('is_new');
        });
    }

    public function down(): void
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->dropColumn(['is_new', 'sale_percent']);
        });
    }
};
