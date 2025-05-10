// Thuc
import { useParams, Link } from "react-router-dom";
import Button from "../../../components/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2 } from 'lucide-react';

export default function GearDetail() {
  const { id } = useParams();
  const [gear, setGear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/gears/${id}`);
        const reviewsResponse = await axios.get(`http://localhost:8000/api/gears/${id}/reviews`);
        if (reviewsResponse.status !== 200) {
          throw new Error("Failed to fetch reviews data");
        }
        setReviews(reviewsResponse.data);
        if (response.status !== 200) {
          throw new Error("Failed to fetch gear data");
        }
        setGear(response.data);
      } catch (error) {
        console.error("Error fetching gear:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGear();
  }, [id]);

  useEffect(() => {
    const user = localStorage.getItem("user_info");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("You must be logged in to submit a review.");

    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      if (!formData.comment.trim()) {
        return alert("Please enter a comment.");
      }
      if (formData.rating === 0) {
        return alert("Please select a rating.");
      }
      await axios.post(
        `http://localhost:8000/api/gears/${id}/review`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedReviews = await axios.get(`http://localhost:8000/api/gears/${id}/reviews`);
      setReviews(updatedReviews.data);
      setFormData({
        comment: "",
        rating: 0,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("You must be logged in to add items to the cart.");
    try {
      await axios.post(
        `http://localhost:8000/api/cart/add/${id}`,
        {
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!gear) return <p className="text-center text-red-600">Gear not found.</p>;

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/gearshop"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>

          Back to Gear Shop
        </Link>
      </div >

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="flex-1 bg-white p-6 rounded-lg">
          <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
          <p className="text-sm text-gray-500 m-3">
            Category: <span
              className={`px-2 py-1 rounded text-xs font-medium mr-1 ${gear.category === 'Accessories' ? 'bg-indigo-100 text-indigo-600' :
                gear.category === 'Bedding' ? 'bg-amber-100 text-amber-700' :
                  gear.category === 'Food' ? 'bg-emerald-100 text-emerald-700' :
                    gear.category === 'Toys' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                }`}
            >
              {gear.category}
            </span>
            Pet Type: <span
              className={`px-2 py-1 rounded text-xs mr-1 font-medium ${gear.petType === 'Dogs' ? 'bg-yellow-100 text-yellow-800'
                : gear.petType === 'Cats' ? 'bg-purple-100 text-purple-800'
                  : gear.petType === 'Rodents' ? 'bg-green-100 text-green-800'
                    : gear.petType === 'Reptiles' ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
            >
              {gear.petType}
            </span>
          </p>

          <div className="mt-3">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{gear.details}</p>
          </div>

          <div className="mt-3 border-t pt-6 text-sm text-gray-600">
            <p><strong>Shipping:</strong> {gear.shipping_info}</p>
            <p><strong>Return Policy:</strong> {gear.return_policy}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{gear.name}</h1>
            <p className="text-gray-600 text-base mb-2">{gear.description}</p>

            <p className="font-poetsen text-3xl text-gray-800 mb-2">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(gear.price)}
            </p>

            <div className="text-sm text-gray-600 mb-4">
              <p>{gear.stock > 0 ? `${gear.stock} in stock` : 'Out of stock'}</p>
              <p>⭐ {gear.rating} ({gear.reviews_count} reviews)</p>
              {gear.is_featured && (
                <p className="text-yellow-600 font-semibold">★ Featured Product</p>
              )}
            </div>

            {gear.highlights?.length > 0 && (
              <ul className="space-y-1.5 text-sm text-gray-600">

                {gear.highlights.map((item, index) => (
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => setQuantity(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm"
            />
            <Button
              disabled={gear.stock <= 0}
              onClick={handleAddToCart}
              className={`w-full ${gear.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h2>

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-md shadow-inner space-y-1">
                <p className="font-semibold text-sm text-gray-700">{review.user_name}</p>
                <div className="flex items-center text-yellow-500 text-sm">
                  {Array(review.rating).fill().map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="ml-2 text-gray-500">({review.rating})</span>
                </div>
                {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-4">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                name="user_name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
                value={userInfo ? userInfo.name : "unknown"}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-2xl focus:outline-none transition-transform transform hover:scale-110 ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    aria-label={`Rate ${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              name="comment"
              required
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
              placeholder="Write your thoughts about the product..."
              value={formData.comment}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <Button type="submit" className="w-full">Submit Review</Button>
          </div>
        </form>
      </div>

    </div>
  );
}
