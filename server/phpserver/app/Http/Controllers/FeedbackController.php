<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        $response = Feedback::with('reply.responder.role')
            ->latest()
            ->get();

        if ($response->isEmpty()) {
            return response()->json(['message' => 'No feedback found.'], 404);
        }
        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json(['message' => 'Feedback created successfully.', 'data' => $feedback], 201);
    }

    public function show($feedbackId)
    {
        $feedback = Feedback::with('reply.responder.role')
            ->find($feedbackId);
        if (!$feedback) {
            return response()->json(['message' => 'Feedback not found.'], 404);
        }
        return response()->json($feedback, 200);
    }

    public function update(Request $request, $id)
    {
        $feedback = Feedback::find($id);

        if (!$feedback) {
            return response()->json(['message' => 'Feedback not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $feedback->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully.',
            'data' => $feedback,
        ]);
    }

    public function destroy($id)
    {
        $feedback = Feedback::find($id);

        if (!$feedback) {
            return response()->json(['message' => 'Feedback not found.'], 404);
        }

        $feedback->delete();

        return response()->json(['message' => 'Feedback deleted successfully.'], 200);
    }
}
