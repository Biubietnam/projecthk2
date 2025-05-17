import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8002/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(response.data.items);
            setTotalAmount(response.data.total_amount);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`http://localhost:8002/api/cart/update/${itemId}`, {
                quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8002/api/cart/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    if (loading) return <p className="text-center text-gray-500 py-10 mt-10">Loading cart...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700 mt-10">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" /> Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center bg-gray-100 p-10 rounded-md">
                    <p className="text-gray-600 mb-4">Your cart is currently empty.</p>
                    <Link
                        to="/gearshop"
                        className="inline-block px-6 py-2 bg-customPurple text-white rounded hover:bg-purple-600 transition"
                    >
                        Browse Gear Shop
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow-sm">
                            <div className="flex items-center gap-4 w-full md:w-2/3">
                                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">Image</span>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-gray-800">{item.gear.name}</h2>
                                    <p className="text-sm text-gray-600">{item.gear.description}</p>
                                    <p className="text-xl font-bold text-green-600 mt-1 tracking-wide">
                                        {
                                            new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(item.price)
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 border border-gray-300 rounded text-center text-sm px-2 py-1"
                                />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-right">
                        <h3 className="text-xl font-bold">
                            Total: {
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(totalAmount)
                            }
                        </h3>
                        <Button className="mt-4" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
