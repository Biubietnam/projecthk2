// Thuc
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GearDetail() {
  const { id } = useParams();
  const [gear, setGear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/gears/${id}`);
        setGear(response.data);
      } catch (error) {
        console.error("Error fetching gear:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!gear) return <p className="text-center text-red-600">Gear not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 mt-10 text-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Image: {gear.image}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{gear.name}</h1>
            <p className="text-gray-600 text-base mb-4">{gear.description}</p>
            <p className="font-poetsen text-3xl text-gray-800 mb-4">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(gear.price)}
            </p>

            <ul className="space-y-1 text-sm text-gray-600 mb-6">
              {gear.highlights.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <p className="text-gray-600 leading-relaxed text-sm">{gear.details}</p>
      </div>
    </div>
  );
}
