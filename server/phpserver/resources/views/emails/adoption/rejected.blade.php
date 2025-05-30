@component('mail::message')
# 🙁 Adoption Request Rejected

Hi {{ $request->user->name }},

We're sorry to inform you that your request to adopt **{{ $request->pet->name }}** has been rejected.

@if($response->note)
**Reason:**  
{{ $response->note }}
@endif

Thank you for your interest and understanding.

Warm regards,  
{{ config('app.name') }}
@endcomponent
