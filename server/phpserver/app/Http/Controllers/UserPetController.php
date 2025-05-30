<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPet;
use App\Models\User; // Đảm bảo bạn đã import model User

class UserPetController extends Controller
{
    //Lấy ID của người dùng và trả về danh sách thú cưng của người dùng đó
    public function getUserPets($id)
{
    $userpets = UserPet::where('user_id', $id)->get();
    return response()->json($userpets);
}
 // Thêm thú cưng mới
    public function store(Request $request)
    {
       $validated = $request->validate([
    'user_id'   => 'required|integer|exists:users,id',
    'name'      => 'required|string|max:255',
    'breed'     => 'required|string|max:255',  // bắt buộc vì schema không nullable
    'age'       => 'nullable|integer|min:0',
    'gender'    => 'required|string|in:Male,Female,Unknown',
    'species'   => 'required|string|in:Dog,Cat,Reptile,Rodent',
    'weight_kg' => 'nullable|numeric|min:0',
    'notes'     => 'nullable|string',
]);

  // Kiểm tra user_id có tồn tại không
    if (!User::find($request->user_id)) {
        return response()->json([
            'error' => 'You must Sign up to add pet'
        ], 401); // 401: Unauthorized
    }

        $pet = UserPet::create($validated);

        return response()->json([
            'message' => 'Thêm thú cưng thành công!',
            'data'    => $pet
        ], 201);
    }
    // delete pet
    public function destroy($id)
{
    $pet = UserPet::find($id);
    if (!$pet) {
        return response()->json(['error' => 'Pet not found'], 404);
    }

    $pet->delete();

    return response()->json(['message' => 'Pet deleted successfully']);
}
//view all pets of a user
public function index($userId)
{
    $pets = UserPet::where('user_id', $userId)->get();
    return response()->json($pets);
}
// Update pet details
public function update(Request $request, $id)
{
    $pet = UserPet::find($id);
    if (!$pet) {
        return response()->json(['error' => 'Pet not found'], 404);
    }

    $validated = $request->validate([
        'name'      => 'required|string|max:255',
        'breed'     => 'required|string|max:255',
        'age'       => 'nullable|integer|min:0',
        'gender'    => 'required|string|in:Male,Female,Unknown',
        'species'   => 'required|string|in:Dog,Cat,Reptile,Rodent',
        'weight_kg' => 'nullable|numeric|min:0',
        'notes'     => 'nullable|string',
    ]);

    $pet->update($validated);

    return response()->json([
        'message' => 'Pet updated successfully',
        'data'    => $pet
    ]);
}

}
