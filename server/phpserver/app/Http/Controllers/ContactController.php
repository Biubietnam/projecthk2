<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::with('reply.responder.role')
            ->latest()
            ->get();
        if ($contacts->isEmpty()) {
            return response()->json(['message' => 'No contacts found'], 404);
        }
        return response()->json($contacts);
    }

    public function show($id)
    {
        $contact = Contact::with('reply.responder.role')
            ->find($id);
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }
        return response()->json($contact);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|in:General Inquiry,Technical Issue,Custom Request,Emergency,Others',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validatedData);
        return response()->json($contact, 201);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $validatedData = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'sometimes|required|string|in:General Inquiry,Technical Issue,Custom Request,Emergency,Others',
            'message' => 'sometimes|required|string',
        ]);

        $contact->update($validatedData);
        return response()->json($contact);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $contact->delete();
        return response()->json(['message' => 'Contact deleted successfully']);
    }
}
