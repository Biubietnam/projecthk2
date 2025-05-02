import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

export default function GearShop() {
    const [gears, setGears] = useState([]);
    const [petFilter, setPetFilter] = useState('All Gears');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/gears')
            .then(response => setGears(response.data))
            .catch(error => console.error('Error fetching pets:', error));
    }, []);

    const dynamicPetTypes = useMemo(() => {
        const types = new Set(gears.map(p => p.petType));
        return ['All Gears', ...Array.from(types).sort()];
    }, [gears]);

    const dynamicCategories = useMemo(() => {
        const categories = new Set(gears.map(p => p.category));
        return ['All Categories', ...Array.from(categories).sort()];
    }, [gears]);

    const filteredGears = useMemo(() => {
        return gears.filter((gear) => {
            const matchesType = petFilter === 'All Gears' || gear.petType === petFilter;
            const matchesCategory = categoryFilter === 'All Categories' || gear.category === categoryFilter;
            const matchesSearch = search === '' || gear.name.toLowerCase().includes(search.toLowerCase()) || gear.description.toLowerCase().includes(search.toLowerCase());
            return matchesType && matchesCategory && matchesSearch;
        });
    }
    , [gears, petFilter, categoryFilter, search]);

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
                        {filteredGears.length > 0 ? (
                            filteredGears.map((product) => (
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