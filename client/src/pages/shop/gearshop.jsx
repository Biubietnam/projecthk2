// Thuc 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const products = [
    {
      id: '1',
      name: 'OrthoFlex Memory Foam Dog Bed',
      description: 'Premium orthopedic memory foam dog bed designed for joint support and comfort.',
      price: 89.99,
      petType: 'Dogs',
      category: 'Bedding',
      image: '/images/bed.jpg',
      highlights: ['Orthopedic memory foam', 'Water-resistant cover', 'Machine washable'],
      details: 'Perfect for aging dogs or dogs with joint issues. Durable and soft, with anti-slip base.',
    },
    {
      id: '2',
      name: 'Whisker Delight Tuna Cat Food',
      description: 'High-protein grain-free tuna cat food with omega-3 for shiny fur and healthy heart.',
      price: 29.99,
      petType: 'Cats',
      category: 'Food',
      image: '/images/tuna.jpg',
      highlights: ['Grain-free', 'Omega-3 fatty acids', 'Vet-approved formula'],
      details: 'Supports immune system, improves digestion, and enhances coat health. 100% natural ingredients.',
    },
    {
      id: '3',
      name: 'Chinchilla Deluxe Cage',
      description: 'Spacious, multi-level metal cage with hammocks and tunnels for small pets.',
      price: 119.99,
      petType: 'Rodents',
      category: 'Bedding',
      image: '/images/cage.jpg',
      highlights: ['Multi-level design', 'Rust-proof coating', 'Easy to clean tray'],
      details: 'Ideal for chinchillas, ferrets, and rats. Comes with ramps, platforms, and chew-proof bars.',
    },
    {
      id: '4',
      name: 'LED UVB Reptile Lamp',
      description: 'Energy-efficient UVB LED light for reptiles to maintain healthy bones and metabolism.',
      price: 34.99,
      petType: 'Reptiles',
      category: 'Accessories',
      image: '/images/lamp.jpg',
      highlights: ['UVB 10.0 spectrum', 'Long-lasting LED', 'Simulates natural daylight'],
      details: 'Vital for reptiles like bearded dragons and geckos. Helps with vitamin D3 synthesis and calcium absorption.',
    },
    {
      id: '5',
      name: 'Interactive Laser Toy for Cats',
      description: 'Rechargeable motion-activated laser toy that stimulates your cat’s natural hunting instinct.',
      price: 22.49,
      petType: 'Cats',
      category: 'Toys',
      image: '/images/laser.jpg',
      highlights: ['Auto mode', 'USB rechargeable', 'Silent motor'],
      details: 'Keeps cats entertained and active when home alone. Safe and durable build with random pattern rotation.',
    },
  ];  

export default function GearShop() {
    const [search, setSearch] = useState('');
    const [petFilter, setPetFilter] = useState('All Pets');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesPet = petFilter === 'All Pets' || product.petType === petFilter;
        const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
        return matchesSearch && matchesPet && matchesCategory;
    });


    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Gear Shop</h1>
                <p className="text-gray-600 mb-6">Quality products for your beloved pets</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="text-custonPurple px-4 py-2 rounded-md border border-customPurple w-full md:w-1/2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 rounded-md border border-customPurple text-sm"
                        value={petFilter}
                        onChange={(e) => setPetFilter(e.target.value)}
                    >
                        <option>All Pets</option>
                        <option>Dogs</option>
                        <option>Cats</option>
                        <option>Rodents</option>
                        <option>Reptiles</option>
                    </select>

                    <select
                        className="px-4 py-2 rounded-md border border-customPurple text-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option>All Categories</option>
                        <option>Food</option>
                        <option>Toys</option>
                        <option>Accessories</option>
                        <option>Grooming</option>
                        <option>Bedding</option>
                    </select>
                </div>
            </div>  

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                    <Link to={`/product/${product.id}`} key={product.id}>
                    <div className="h-full border border-customPurple rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition cursor-pointer">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-40 bg-gray-500 mb-4 flex items-center justify-center">
                                <span className="text-gray-700">Image</span>
                            </div>
                            <h2 className="text-lg font-semibold text-center">{product.name}</h2>
                            <p className="text-gray-500 text-sm mb-2 text-center">{product.description}</p>
                        </div>

                        <div className="mt-auto flex flex-col items-center">
                            <p className="font-bold mb-3">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
