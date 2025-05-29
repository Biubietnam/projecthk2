<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id(); // service_id
            $table->string('service_name'); // ví dụ: Spa, Vet, Grooming, ...
            $table->integer('duration_minutes'); // thời gian thực hiện dịch vụ
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
}