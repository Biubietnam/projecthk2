<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Service;

class BookingController extends Controller
{
    // Generate time slots based on service duration
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

    // API: Get all available and booked time slots for a given date and service
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

 // API: Get all bookings of a specific user
public function showUserBookings($userId)
{
    $bookings = Booking::with(['pet', 'service'])
        ->where('user_id', $userId)
        ->get()
        ->map(function ($booking) {
            return [
                'id' => $booking->id,
                'pet' => $booking->pet,
                'service_name' => $booking->service->service_name ?? null,
                'date' => $booking->date,
                'time_slot' => $booking->time_slot,
                'notes' => $booking->notes,
            ];
        });

    return response()->json($bookings);
}
// API: Delete a booking by ID
public function destroy($id)
{
    $booking = Booking::find($id);

    if (!$booking) {
        return response()->json(['error' => 'Booking not found'], 404);
    }

    $booking->delete();

    return response()->json(['message' => 'Booking deleted successfully']);
}

    // API: Create a new booking
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        'pet_id' => 'required|integer|exists:user_pets,id',
        'service_id' => 'required|integer',
        'date' => 'required|date',
        'time_slot' => 'required|string',
        ]);

        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->where('time_slot', $request->time_slot)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'This time slot has already been booked'], 409);
        }

        $service = Service::find($request->service_id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

       $bookingData = $request->all();
        $bookingData['service_name'] = $service->service_name; // Thêm tên service vào dữ liệu

        $booking = Booking::create($bookingData); // Dùng dữ liệu đã cập nhật


        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }
}
