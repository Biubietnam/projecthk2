<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\ContactReply;
use Illuminate\Support\Facades\Auth;

class ContactReplyController extends Controller
{
    public function index($contactId)
    {
        $replies = ContactReply::with('responder')
            ->where('contact_id', $contactId)
            ->latest()
            ->get();

        return response()->json($replies);
    }

    public function store(Request $request, $contactId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $contact = Contact::findOrFail($contactId);

        $reply = ContactReply::create([
            'contact_id'   => $contact->id,
            'responder_id' => Auth::id(),
            'message'      => $request->message,
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
            'reply'   => $reply->load('responder')
        ], 201);
    }

    public function destroy($id)
    {
        $reply = ContactReply::findOrFail($id);
        $reply->delete();

        return response()->json(['message' => 'Reply deleted']);
    }
}
