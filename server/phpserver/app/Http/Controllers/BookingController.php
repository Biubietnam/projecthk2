<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Service;

class BookingController extends Controller
{
    // Tạo khung giờ theo thời lượng dịch vụ
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

    // API: Lấy tất cả khung giờ và các khung giờ đã được đặt
    public function getBookedTimeSlots(Request $request)
    {
        $date = $request->query('date');
        $serviceId = $request->query('service_id');

        $service = Service::find($serviceId);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $duration = $service->duration_minutes;
        $allSlots = $this->generateTimeSlots('08:00', '17:00', $duration);

        $bookedSlots = Booking::where('date', $date)
            ->where('service_id', $serviceId)
            ->pluck('time_slot')
            ->toArray();

        return response()->json([
            'all_slots' => $allSlots,
            'booked_slots' => $bookedSlots
        ]);
    }

    /// API: Lấy toàn bộ danh sách booking
    public function index()
    {
        $bookings = Booking::all();
        return response()->json($bookings);
    }

     // API: Tạo booking mới
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'pet_id' => 'required|integer|exists:user_pets,id',
            'service_id' => 'required|integer',
            'date' => 'required|date',
            'time_slot' => 'required|string',
        ]);

        // Kiểm tra khung giờ đã được đặt chưa
        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->where('time_slot', $request->time_slot)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'This time slot has already been booked'], 409);
        }
        // Lấy tên dịch vụ để lưu thêm nếu cần
        $service = Service::find($request->service_id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        // Tạo booking mới, thêm tên dịch vụ
        $bookingData = $request->all();
        $bookingData['service_name'] = $service->name; // Assuming there's a service_name column in bookings table

        $booking = Booking::create($bookingData);

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }
}
