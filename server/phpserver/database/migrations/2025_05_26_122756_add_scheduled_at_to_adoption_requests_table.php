<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('adoption_requests', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable()->after('approved_at');
        });
    }

    public function down()
    {
        Schema::table('adoption_requests', function (Blueprint $table) {
            $table->dropColumn('scheduled_at');
        });
    }
};
