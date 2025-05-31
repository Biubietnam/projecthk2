// File: components/ReviewUnreviewedProducts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/Button';

export default function ReviewUnreviewedProducts({ openModal }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreviewed = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/api/reviews/unreviewed', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching unreviewed products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnreviewed();
  }, []);

  const handleReviewClick = (item) => {
    openModal({
      title: `Review for Product #${item.gear_id}`,
      showConfirm: false,
      body: <ReviewForm gearId={item.gear_id} receiptId={item.receipt_id} />,
    });
  };

  if (loading) return <p className="text-center text-gray-400">Loading your reviews...</p>;
  if (!products.length) return <p className="text-center text-gray-500">You have no pending reviews. Well done!</p>;

  return (
    <div className="w-full max-w-6xl mx-auto mt-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Products Waiting for Your Feedback</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition duration-300 ease-in-out"
          >
            {item.main_image && (
              <img
                src={item.main_image}
                alt={`Product ${item.gear_id}`}
                className="w-24 h-24 object-contain rounded-lg"
              />
            )}
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-sm text-gray-500">Receipt ID</p>
                <p className="text-base font-medium text-gray-900">{item.receipt_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product ID</p>
                <p className="text-base font-medium text-gray-900">{item.gear_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-base text-gray-800">{item.quantity}</p>
              </div>
              <Button onClick={() => handleReviewClick(item)} className="w-full text-sm py-2 rounded-xl font-medium bg-black text-white hover:bg-gray-900 transition">
                Write Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ gearId, receiptId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://localhost:8000/api/reviews',
        { gear_id: gearId, receipt_id: receiptId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Review submitted successfully.');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('❌ Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl font-semibold transition-transform transform hover:scale-110 ${
                rating >= value ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
        <textarea
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full text-sm py-2 rounded-xl font-medium bg-black text-white hover:bg-gray-900 transition">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
