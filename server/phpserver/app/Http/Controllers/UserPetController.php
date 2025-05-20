<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPet;

class UserPetController extends Controller
{
    //Lấy ID của người dùng và trả về danh sách thú cưng của người dùng đó
    public function getUserPets($id)
{
    $userpets = UserPet::where('user_id', $id)->get();
    return response()->json($userpets);
}
}
