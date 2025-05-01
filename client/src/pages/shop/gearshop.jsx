import React, { useState, useMemo } from 'react';
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
const uniquePetTypes = new Set(products.map(product => product.petType));
const dynamicPetTypes = ['All Pets', ...Array.from(uniquePetTypes).sort()];

const uniqueCategories = new Set(products.map(product => product.category));
const dynamicCategories = ['All Categories', ...Array.from(uniqueCategories).sort()];


export default function GearShop() {
    const [search, setSearch] = useState('');
    const [petFilter, setPetFilter] = useState(dynamicPetTypes[0]);
    const [categoryFilter, setCategoryFilter] = useState(dynamicCategories[0]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
            const matchesPet = petFilter === 'All Pets' || product.petType === petFilter;
            const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
            return matchesSearch && matchesPet && matchesCategory;
        });
    }, [search, petFilter, categoryFilter]);

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="text-center">
                <h1 className="text-4xl mb-2 font-bold">Gear Shop</h1>
                <p className="text-gray-600 mb-6">Quality products for your beloved pets</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="px-4 py-2 rounded-md border border-customPurple w-full md:w-1/2 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search products"
                />

                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 rounded-md border border-customPurple text-sm"
                        value={petFilter}
                        onChange={(e) => setPetFilter(e.target.value)}
                        aria-label="Filter by pet type"
                    >
                        {dynamicPetTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 rounded-md border border-customPurple text-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        aria-label="Filter by category"
                    >
                        {dynamicCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="h-full flex">
                            <div className="flex flex-col w-full border border-customPurple rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">

                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <span className="text-sm">Image Placeholder</span>
                                </div>

                                <div className="p-4 flex flex-col items-center text-center flex-grow">
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                </div>

                                <div className="px-4 pb-4 mt-auto flex justify-center">
                                    <p className="font-poetsen text-lg text-gray-800">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(product.price)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No products found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};