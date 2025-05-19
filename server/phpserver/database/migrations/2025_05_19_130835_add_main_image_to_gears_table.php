<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->string('main_image')->nullable()->after('stock');
        });
    }

    public function down()
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->dropColumn('main_image');
        });
    }
};
