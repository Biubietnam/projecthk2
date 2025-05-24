<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // Liên kết đến bảng users
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Liên kết đến bảng user_pets
            $table->foreignId('pet_id')->constrained('user_pets')->onDelete('cascade');

            // Liên kết đến bảng services
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');

            // Thêm cột service_name
            $table->string('service_name');

            // Ngày và khung giờ đặt
            $table->date('date');
            $table->string('time_slot'); // ví dụ "09:00", "10:30"

            // Trạng thái đặt lịch
            $table->enum('status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])->default('Pending');

            // Ghi chú thêm
            $table->text('notes')->nullable();

            // Tự động lưu thời gian tạo và cập nhật
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}
