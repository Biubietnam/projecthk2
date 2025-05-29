<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Service;

class BookingController extends Controller
{
    // Tạo danh sách khung giờ theo duration service
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

    // API: Lấy khung giờ đã đặt và tất cả khung giờ có thể đặt cho service + date
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
            ->whereNotIn('status', ['Cancelled'])  // loại trừ booking đã hủy
            ->pluck('time_slot')
            ->toArray();

        return response()->json([
            'all_slots' => $allSlots,
            'booked_slots' => $bookedSlots
        ]);
    }

    // API: Lấy booking theo user và theo tab (upcoming/history)
    public function showUserBookings(Request $request, $userId)
    {
        $type = $request->query('type', 'upcoming'); // Mặc định là upcoming

        $query = Booking::with(['pet', 'service'])
            ->where('user_id', $userId);

        if ($type === 'upcoming') {
            $query->whereIn('status', ['Pending', 'Confirmed']);
        } elseif ($type === 'history') {
            $query->whereIn('status', ['Completed', 'Cancelled']);
        }

        $bookings = $query
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'pet' => $booking->pet,
                    'service_name' => optional($booking->service)->service_name,
                    'date' => $booking->date,
                    'time_slot' => $booking->time_slot,
                    'notes' => $booking->notes,
                    'status' => $booking->status,
                ];
            });

        return response()->json($bookings);
    }

    // API: Tạo booking mới
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'pet_id' => 'required|integer|exists:user_pets,id',
            'service_id' => 'required|integer|exists:services,id',
            'date' => 'required|date',
            'time_slot' => 'required|string',
        ]);

        // Kiểm tra trùng slot, loại bỏ booking đã hủy
        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->where('time_slot', $request->time_slot)
            ->whereNotIn('status', ['Cancelled'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'This time slot has already been booked'], 409);
        }

        $service = Service::find($request->service_id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $bookingData = $request->all();
        $bookingData['service_name'] = $service->service_name;
        $bookingData['status'] = 'Pending';

        $booking = Booking::create($bookingData);

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }

    // API: Hủy booking (update status thành Cancelled)
    public function cancel($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($booking->status === 'Cancelled') {
            return response()->json(['error' => 'Booking is already cancelled'], 400);
        }

        $booking->status = 'Cancelled';
        $booking->save();

        return response()->json(['message' => 'Booking cancelled successfully']);
    }
//BookManageMent part
    public function index()
{
    $bookings = Booking::with(['pet', 'service', 'user'])->orderBy('date', 'desc')->get();

    return response()->json($bookings);
}

public function update(Request $request, $id)
{
    $booking = Booking::find($id);
    if (!$booking) {
        return response()->json(['error' => 'Booking not found'], 404);
    }

    $booking->update($request->only(['status', 'notes', 'time_slot', 'date', 'service_id', 'pet_id']));

    return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking]);
}
}
