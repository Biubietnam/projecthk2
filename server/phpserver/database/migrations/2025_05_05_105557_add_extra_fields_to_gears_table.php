<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->string('shipping_info')->default('Delivered within 3–5 business days');
            $table->string('return_policy')->default('14-day easy return if unused');
            $table->integer('stock')->default(100);
            $table->float('rating')->default(4.5);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->string('slug')->nullable()->unique();
        });
    }
    
    public function down()
    {
        Schema::table('gears', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_info', 'return_policy', 'stock', 'rating',
                'reviews_count', 'is_featured', 'slug'
            ]);
        });
    }
    
};
