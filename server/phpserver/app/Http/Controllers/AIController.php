<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function ask(Request $request)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4',
                'messages' => [
                    ['role' => 'user', 'content' => $request->input('message')],
                ],
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Failed to get response from OpenAI',
                    'details' => $response->json()
                ], 500);
            }

            return response()->json([
                'answer' => $response['choices'][0]['message']['content']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Exception caught',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
