<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReceivedMail;

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
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]*$/'],
            'subject' => [
                'required',
                'string',
                Rule::in(['General Inquiry', 'Technical Issue', 'Custom Request', 'Emergency', 'Others']),
            ],
            'message' => ['required', 'string', 'min:10'],
        ]);

        $contact = Contact::create($validatedData);
        Mail::to($contact->email)->send(new ContactReceivedMail($contact));
        return response()->json($contact, 201);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $validatedData = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]*$/'],
            'subject' => [
                'required',
                'string',
                Rule::in(['General Inquiry', 'Technical Issue', 'Custom Request', 'Emergency', 'Others']),
            ],
            'message' => ['required', 'string', 'min:10'],
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
