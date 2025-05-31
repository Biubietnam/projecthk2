// Thuc
import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Button from "../../../components/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Plus, Minus, Loader } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from 'framer-motion';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  const breadcrumbList = paths.map((segment, index) => ({
    label: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
    to: '/' + paths.slice(0, index + 1).join('/'),
  }));

  return (
    <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-customPurple text-gray-500 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
        Home
      </Link>
      {breadcrumbList.map((item, idx) => (
        <React.Fragment key={item.to}>
          <span className="text-gray-400">/</span>
          {idx === breadcrumbList.length - 1 ? (
            <span className="text-gray-700 font-semibold">{item.label}</span>
          ) : (
            <Link to={item.to} className="hover:text-customPurple">{item.label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function GearDetail() {
  const { id } = useParams();
  const [gear, setGear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGear = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/gears/${id}`);
        if (res.status === 200) {
          setGear(res.data);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error("Failed to fetch gear details:", err);
        toast.error("Failed to load gear details");
      } finally {
        setLoading(false);
      }
    };
    fetchGear();
  }, [id]);

  const handleAddToCart = async () => {
    setLoadingAddToCart(true);
    const token = localStorage.getItem("access_token");
    if (!token) return alert("Login required");
    try {
      await axios.post(`http://localhost:8000/api/cart/add/${id}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Add failed");
    } finally {
      setLoadingAddToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen w-full px-4 max-w-[1280px] mx-auto py-10 text-gray-700 mt-10">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#f9f9f9",
            color: "#333",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            fontSize: "14px",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ECFDF5",
          },
        }}
      />
      <Breadcrumb />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-4xl font-semibold mb-3 text-gray-800">{gear.name}</h1>
          <div className="flex justify-between text-sm mb-4 text-gray-600">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(gear.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    strokeWidth={2}
                    fill={i < Math.round(gear.rating) ? '#facc15' : 'none'}
                  />
                ))}
              </div>
              <span className="text-gray-500 ml-1">({gear.reviews_count} reviews)</span>
            </div>
            {gear.is_featured === 1 && <span className="text-yellow-600">★ Featured</span>}
          </div>
          <div className="rounded-xl overflow-hidden">
            {gear?.images?.length ? (
              <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={10} slidesPerView={1}>
                {gear.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="h-[34rem] bg-white flex justify-center items-center">
                      <img src={img} alt={`Gear ${i}`} className="object-contain max-h-full" />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-96 flex justify-center items-center bg-gray-100">No images</div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Category: <span className="font-medium">{gear.category}</span> — Pet Type: <span className="font-medium">{gear.petType}</span>
          </p>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:w-2/5 bg-white p-6 rounded-2xl shadow space-y-6">
          <p className="text-4xl font-semibold text-gray-800">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(gear.price)}
          </p>

          {gear.highlights?.length > 0 && (
            <ul className="border-t pt-4 text-sm space-y-2 text-gray-700">
              {gear.highlights.map((text, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> {text}
                </li>
              ))}
            </ul>
          )}

          <p>
            {gear.stock > 0
              ? <span className="text-green-600 font-medium">{gear.stock} in stock</span>
              : <span className="text-red-500 font-medium">Out of stock</span>}
          </p>

          <div className="flex items-center gap-4 border-t pt-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded-md text-center text-sm px-3 py-2"
            />
            <Button disabled={gear.stock <= 0 || loadingAddToCart} onClick={handleAddToCart} className="w-full text-sm relative">
              {loadingAddToCart ? <span className="flex items-center gap-2"><Loader className="animate-spin w-4 h-4" /> Loading...</span> : "Add to Cart"}
            </Button>
          </div>

          <div className="border-t pt-4">
            <button onClick={() => setOpenDetails(!openDetails)} className="w-full flex justify-between font-medium py-2">
              Product Details {openDetails ? <Minus className="text-customPurple w-5 h-5" /> : <Plus className="text-customPurple w-5 h-5" />}
            </button>
            <AnimatePresence>
              {openDetails && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-gray-600 mt-2 overflow-hidden">
                  {gear.details}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t pt-4">
            <button onClick={() => setOpenDescription(!openDescription)} className="w-full flex justify-between font-medium py-2">
              Product Description {openDescription ? <Minus className="text-customPurple w-5 h-5" /> : <Plus className="text-customPurple w-5 h-5" />}
            </button>
            <AnimatePresence>
              {openDescription && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-gray-600 mt-2 overflow-hidden">
                  {gear.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <motion.div layout key={r.id} className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-sm text-gray-700">{r.user_name}</p>
                <div className="flex items-center text-yellow-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-gray-500">({r.rating})</span>
                </div>
                {r.comment && <p className="text-gray-700 text-sm mt-1">{r.comment}</p>}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
