import { useState } from 'react';
import axios from 'axios';

export default function AskAI() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = async () => {
    const res = await axios.post('https://thoriumstudio.xyz/api/ask-ai', {
      message: userInput
    });
    setResponse(res.data.answer);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask anything about pet health..."
      />
      <button
        onClick={handleAsk}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ask AI
      </button>
      {response && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <strong>AI says:</strong> {response}
        </div>
      )}
    </div>
  );
}


