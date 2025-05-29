<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdoptionResponsesTable extends Migration
{
    public function up()
    {
        Schema::create('adoption_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adoption_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('responder_id')->constrained('users')->onDelete('cascade');
            $table->enum('action', ['approved', 'rejected']);
            $table->text('note')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('adoption_responses');
    }
}