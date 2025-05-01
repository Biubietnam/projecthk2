<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Authenticating...</title>
</head>

<body>
    <script>
        @if(isset($token) && $token)
            const token = "{{ $token }}";
            const user = {!! json_encode($user) !!};
    
            window.opener.postMessage({
                type: 'OAUTH_SUCCESS',
                token,
                user,
            }, "*");
    
            window.close();
        @else
            alert("{{ $message ?? 'Login failed.' }}");
            window.close();
        @endif
    </script>
    <p>Authenticating, please wait...</p>
</body>

</html>
