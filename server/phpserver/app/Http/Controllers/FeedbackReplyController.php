<?php

namespace App\Http\Controllers;

use App\Models\FeedbackReply;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackReplyController extends Controller
{
    public function index($feedback)
    {
        $replies = FeedbackReply::with('responder')
            ->where('feedback_id', $feedback)
            ->latest()
            ->get();
        return response()->json($replies);
    }

    

    public function store(Request $request, $feedbackId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $feedback = Feedback::findOrFail($feedbackId);

        $reply = FeedbackReply::create([
            'feedback_id'   => $feedback->id,
            'responder_id'  => Auth::id(),
            'message'       => $request->message,
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
            'reply'   => $reply->load('responder'),
        ], 201);
    }

    public function destroy($id)
    {
        $reply = FeedbackReply::findOrFail($id);
        $reply->delete();

        return response()->json(['message' => 'Reply deleted']);
    }
}
