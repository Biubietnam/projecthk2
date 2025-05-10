import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import { FaMoneyBillAlt, FaCreditCard, FaPaypal } from 'react-icons/fa';

export default function Checkout() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'cod',
    });
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartItems(response.data.items);
                setTotalAmount(response.data.total_amount);
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    setFormData({
                        ...formData,
                        fullName: response.data.full_name,
                        email: response.data.email,
                        phone: response.data.phone,
                        address: response.data.address,
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await new Promise((res) => setTimeout(res, 1500));
            alert('🎉 Order placed successfully!');
            navigate('/thank-you');
        } catch (err) {
            alert('❌ Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const paymentOptions = [
        { value: 'cod', label: 'Cash on Delivery', icon: <FaMoneyBillAlt className="text-green-600 text-2xl" /> },
        { value: 'card', label: 'Credit/Debit Card', icon: <FaCreditCard className="text-blue-600 text-2xl" /> },
        { value: 'paypal', label: 'PayPal', icon: <FaPaypal className="text-indigo-600 text-2xl" /> },
    ];

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
            <div className="mb-2">
                <Link
                    to="/cart"
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
                    Back to Cart
                </Link>
            </div >

            <div className="flex flex-col lg:flex-row gap-6 hover w-full">
                <div className="bg-white p-6 rounded shadow space-y-4 lg:basis-1/2 w-full hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <ul className="min-w-full divide-y divide-gray-200 text-sm">
                            <li className="bg-gray-50 grid grid-cols-3 font-semibold text-gray-700 px-4 py-2">
                                <span className="text-left">Product</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-right">Subtotal</span>
                            </li>

                            {cartItems.map(item => (
                                <li key={item.id} className="grid grid-cols-3 items-center px-4 py-2">
                                    <span className="truncate text-gray-900">{item.gear.name}</span>
                                    <span className="text-center text-gray-700">x{item.quantity}</span>
                                    <span className="text-right font-medium text-gray-900">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(item.price * item.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t pt-4 text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="font-medium">Subtotal</span>
                            <span>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow hover:shadow-lg transition-shadow duration-300 lg:basis-1/2 w-full">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <div className="flex flex-col gap-4">
                            {paymentOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paymentMethod: option.value })}
                                    className={`flex items-center gap-3 px-4 py-3 border rounded w-full text-left 
            ${formData.paymentMethod === option.value
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 bg-white'
                                        } hover:shadow-md`}
                                >
                                    {option.icon}
                                    <span className="text-sm font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
