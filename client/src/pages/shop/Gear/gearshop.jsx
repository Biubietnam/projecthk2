import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

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


    const showSwiper = filteredGears.length > 0;

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="text-center">
                <h1 className="text-4xl mb-2 font-bold font-poetsen flex items-center justify-center gap-2 animate-fade-in">
                    🛍️ Gear Shop
                </h1>
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

            <div>
                {showSwiper ? (
                    <>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={30}
                            slidesPerView={3}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{
                                el: '.swiper-pagination-custom',
                                clickable: true,
                                type: 'bullets',
                            }}
                            className="!pb-16"
                            breakpoints={{
                                0: { slidesPerView: 1, spaceBetween: 15 },
                                640: { slidesPerView: 1, spaceBetween: 20 },
                                768: { slidesPerView: 2, spaceBetween: 25 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                        >
                            {filteredGears.map((product) => (
                                <SwiperSlide key={product.id} className="h-auto">
                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">

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

                                            <div className="text-sm text-gray-500 m-1 text-center">
                                                <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                                                <p>⭐ {product.rating} ({product.reviews_count} reviews)</p>
                                                {product.is_featured && <p className="text-yellow-600 font-semibold">★ Featured</p>}
                                            </div>

                                            <div className="text-xs text-gray-400 m-1 text-center">
                                                <p>{product.shipping_info}</p>
                                                <p>{product.return_policy}</p>
                                            </div>

                                            <div className="px-4 pb-4 mt-auto flex justify-center gap-2">
                                                <Link to={`/product/${product.id}`}
                                                    className="py-2 px-4 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition w-full text-center"
                                                >
                                                    Details
                                                </Link>
                                                <button
                                                    className="py-2 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition w-full text-center"
                                                >
                                                    Add to card
                                                </button>
                                            </div>
                                        </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="relative w-full mt-6">
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    type="button"
                                    aria-label="Last slide"
                                    className="swiper-button-prev-custom flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <div className="swiper-pagination-custom text-center flex-grow mx-4">
                                </div>

                                <button
                                    type="button"
                                    aria-label="Next slide"
                                    className="swiper-button-next-custom flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-10">No gears found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};