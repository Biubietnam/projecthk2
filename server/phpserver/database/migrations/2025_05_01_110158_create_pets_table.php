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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('breed');
            $table->string('age');
            $table->string('type');
            $table->text('description');
            $table->string('gender');
            $table->string('weight');
            $table->string('color');
            $table->json('tags')->nullable();
            $table->decimal('adoptionFee', 8, 2);
            $table->string('image')->nullable();
            $table->text('careDiet')->nullable();
            $table->text('careExercise')->nullable();
            $table->text('careGrooming')->nullable();
            $table->timestamps();
        });
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
