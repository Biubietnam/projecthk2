@component('mail::message')
# 🎉 Adoption Approved!

Hi {{ $request->user->name }},

Your request to adopt **{{ $request->pet->name }}** has been approved.

**Approved at:** {{ \Carbon\Carbon::parse($request->approved_at)->format('F j, Y \a\t H:i') }}

@if($response->note)
> **Note from our team:**  
> {{ $response->note }}
@endif

We'll contact you shortly with next steps.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
