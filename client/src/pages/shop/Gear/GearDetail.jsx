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

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/gears/${id}`);
        setGear(response.data);
      } catch (error) {
        console.error("Error fetching gear:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGear();
  }, [id]);

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
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm"
            />
            <Button>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
