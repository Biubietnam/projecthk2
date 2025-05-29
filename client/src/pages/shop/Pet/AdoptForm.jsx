import React, { useState } from 'react';
import axios from 'axios';

export default function AdoptForm({ pet }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return alert('You must be logged in to submit adoption request.');

    setLoading(true);
    try {
      await axios.post('https://thoriumstudio.xyz/api/adoption-requests', {
        pet_id: pet.id,
        note,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Adoption request failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center text-green-600 font-medium">
        ✅ Adoption request for <strong>{pet.name}</strong> submitted successfully!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-gray-700 text-sm">
        You're submitting an adoption request for <strong>{pet.name}</strong>. Please leave a note if needed.
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Your note (optional)..."
        className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
