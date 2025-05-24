<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking; // Đảm bảo bạn đã import model Booking
use App\Models\Service; // Đảm bảo bạn đã import model Service

class BookingController extends Controller
{
     // Hàm sinh khung giờ theo duration
    private function generateTimeSlots($start, $end, $duration)
    {
        $slots = [];
        $current = strtotime($start);
        $endTime = strtotime($end);

        while ($current + ($duration * 60) <= $endTime) {
            $slots[] = date('H:i', $current);
            $current += $duration * 60;
        }

        return $slots;
    }

    // API lấy giờ đã đặt
    public function getBookedTimeSlots(Request $request)
    {
        $date = $request->query('date');
        $serviceId = $request->query('service_id');

        // Lấy duration của dịch vụ
        $service = Service::find($serviceId);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $duration = $service->duration_minutes;
        $allSlots = $this->generateTimeSlots('08:00', '17:00', $duration);

        // Lấy giờ đã đặt
        $bookedSlots = Booking::where('date', $date)
            ->where('service_id', $serviceId)
            ->pluck('time_slot')
            ->toArray();

        // Trả về cả giờ có thể chọn và giờ đã đặt
        return response()->json([
            'all_slots' => $allSlots,
            'booked_slots' => $bookedSlots
        ]);
    }
        // Lấy danh sách booking (có thể thêm lọc sau)
    public function index()
    {
        $bookings = Booking::all();
        return response()->json($bookings);
    }

    // Tạo booking mới
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'pet_id' => 'required|integer',
            'service_id' => 'required|integer',
            'date' => 'required|date',
            'time_slot' => 'required|string',
        ]);

        // Kiểm tra thời gian đã đặt chưa
        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->where('time_slot', $request->time_slot)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Thời gian này đã được đặt trước'], 409);
        }

        $booking = Booking::create($request->all());

        return response()->json(['message' => 'Đặt lịch thành công', 'booking' => $booking], 201);
    }
}
