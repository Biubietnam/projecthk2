<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Gear;

class GearController extends Controller
{
    public function index()
    {
        return response()->json(Gear::all());
    }

    public function show($id)
    {
        $gear = Gear::findOrFail($id);
        return response()->json($gear);
    }
}
