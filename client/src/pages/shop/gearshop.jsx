//Thuc 
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Button from "../../components/Button";
const products = [
    {
        id: 1,
        name: 'LED Collar for Dogs and Cats',
        price: '150,000 VND',
        imageUrl: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        name: 'Hoodie for Dogs',
        price: '250,000 VND',
        imageUrl: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        name: 'Backpack Carrier for Cats',
        price: '500,000 VND',
        imageUrl: 'https://via.placeholder.com/150',
    },
];

const GearShop = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Pet Gear Shop</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                        <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
                        <p className="mt-2 text-gray-600">{product.price}</p>
                        <Button
                            className="flex items-center justify-center gap-2 font-bold text-white bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded-md"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to cart
                        </Button>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default GearShop;
