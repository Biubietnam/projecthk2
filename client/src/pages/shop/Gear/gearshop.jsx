import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { Loader } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { Navigation, Pagination, Grid } from 'swiper/modules';
import Button from '../../../components/Button';

function Breadcrumb() {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbList = [];

    paths.forEach((segment, index) => {
        const path = '/' + paths.slice(0, index + 1).join('/');
        breadcrumbList.push({
            label: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
            to: path,
        });
    });

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
                        <span className="text-gray-700 font-medium">{item.label}</span>
                    ) : (
                        <Link to={item.to} className="hover:text-customPurple">{item.label}</Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

export default function GearShop() {
    const [gears, setGears] = useState([]);
    const [petFilter, setPetFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [buttonLoadingID, setButtonLoadingID] = useState(null);
    const topRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8000/api/gears')
            .then(response => {
                setGears(response.data);
                console.log('Gears fetched successfully:', response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching pets:', error);
                toast.error('Failed to load gears. Please try again later.');
                setLoading(false);
            })
    }, []);

    const dynamicPetTypes = useMemo(() => {
        const types = new Set(gears.map(p => p.petType));
        return ['All', ...Array.from(types).sort()];
    }, [gears]);

    const dynamicCategories = useMemo(() => {
        const categories = new Set(gears.map(p => p.category));
        return ['All', ...Array.from(categories).sort()];
    }, [gears]);

    const filteredGears = useMemo(() => {
        return gears.filter((gear) => {
            const matchesType = petFilter === 'All' || gear.petType === petFilter;
            const matchesCategory = categoryFilter === 'All' || gear.category === categoryFilter;
            const matchesSearch = search === '' || gear.name.toLowerCase().includes(search.toLowerCase()) || gear.description.toLowerCase().includes(search.toLowerCase());
            return matchesType && matchesCategory && matchesSearch;
        });
    }
        , [gears, petFilter, categoryFilter, search]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Dogs':
                return <img src="https://img.icons8.com/?size=100&id=121419&format=png&color=000000" alt="Dog" className="w-8 h-8" />;
            case 'Cats':
                return <img src="https://img.icons8.com/?size=100&id=121439&format=png&color=000000" alt="Cat" className="w-8 h-8" />;
            case 'Rodents':
                return <img src="https://img.icons8.com/?size=100&id=41034&format=png&color=000000" alt="Rodent" className="w-8 h-8" />;
            case 'Reptiles':
                return <img src="https://img.icons8.com/?size=100&id=95597&format=png&color=000000" alt="Reptile" className="w-8 h-8" />;
            default:
                return <img src="https://img.icons8.com/?size=100&id=121391&format=png&color=000000" alt="All Pets" className="w-8 h-8" />;
        }
    };

    const handleAddToCart = async (id) => {
        setButtonLoadingID(id);
        const token = localStorage.getItem("access_token");
        if (!token) return alert("You must be logged in to add items to the cart.");
        try {
            await axios.post(
                `http://localhost:8000/api/cart/add/${id}`,
                {
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("Failed to add item to cart. Please try again.");
        } finally {
            setButtonLoadingID(null);
        }
    };

    const smoothScrollToTopRef = (targetRef, duration = 500) => {
        if (!targetRef?.current) return;

        const targetY = targetRef.current.getBoundingClientRect().top + window.scrollY;
        const startY = window.scrollY;
        const distanceY = targetY - startY;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeInOut = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startY + distanceY * easeInOut);

            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const showSwiper = filteredGears.length > 0;

    return loading ? (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0 1 14.14 14.14A10 10 0 0 1 4.93 4.93z"></path>
                </svg>
            </div>
        </div>
    ) : (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
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
            <div ref={topRef} className="text-center">
                <h1 className="text-4xl text-gray-900 mb-2 tracking-tight font-semibold">🛍️ Gear Shop</h1>
                <p className="text-gray-500 text-sm">Premium products for your beloved pets</p>
            </div>

            <div className="w-full flex justify-center mt-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value.trimStart();
                        setSearch(value);
                    }}
                    aria-label="Search products"
                    className="w-full max-w-lg px-5 py-3 text-sm rounded-full bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-customPurpleDark focus:outline-none placeholder-gray-400 transition"
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {dynamicPetTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setPetFilter(type)}
                                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border text-xs font-medium transition-all duration-200
    ${petFilter === type
                                            ? "bg-customPurpleDark text-white border-customPurple shadow-md"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-customPurpleDark hover:text-customPurpleDark"}
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPurple focus:scale-105
    active:scale-95
  `}
                                    aria-label={`Filter pets by ${type}`}
                                >
                                    {getTypeIcon(type)}
                                    <span className="mt-1">{type}</span>
                                </button>

                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {dynamicCategories.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setCategoryFilter(type)}
                                    className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 border 
          ${categoryFilter === type
                                            ? "bg-customPurpleDark text-white border-customPurple shadow"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-customPurpleDark"}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPurple focus:scale-105 active:scale-95
        `}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6'>
                {showSwiper ? (
                    <>
                        <Swiper
                            modules={[Navigation, Pagination, Grid]}
                            spaceBetween={30}
                            slidesPerView={3}
                            slidesPerGroup={3}
                            speed={500}
                            onSlideChange={() => {
                                smoothScrollToTopRef(topRef, 500);
                            }}
                            grid={{
                                rows: 2,
                                fill: 'row',
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{
                                el: '.swiper-pagination-custom',
                                clickable: true,
                                type: 'bullets',
                            }}
                            className="swiper !pb-16"
                            breakpoints={{
                                0: { slidesPerView: 1, grid: { rows: 1 } },
                                640: { slidesPerView: 1, grid: { rows: 1 } },
                                768: { slidesPerView: 2, grid: { rows: 2 } },
                                1024: { slidesPerView: 3, grid: { rows: 2 } },
                                1280: { slidesPerView: 3, grid: { rows: 2 } },
                                1536: { slidesPerView: 3, grid: { rows: 2 } },
                                1920: { slidesPerView: 4, grid: { rows: 2 } },
                            }}
                        >
                            {filteredGears.map((product) => (
                                <SwiperSlide key={product.id} className="!h-auto">
                                    <div
                                        className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-[500px]"
                                    >
                                        <div className="w-full h-[250px] flex items-center justify-center overflow-hidden">
                                            <img
                                                src={typeof product.main_image === 'string' ? product.main_image : product.main_image?.url}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain transition duration-500 ease-in-out transform group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

                                        <div className="p-4 flex flex-col items-center text-center flex-grow">
                                            <h2 className="text-lg line-clamp-2 font-semibold">{product.name}</h2>

                                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                                {product.is_new ? (
                                                    <span className="bg-green-100 text-green-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                                                        NEW
                                                    </span>
                                                ) : null}
                                                {product.sale_percent > 0 ? (
                                                    <span className="bg-red-100 text-red-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                                                        -{product.sale_percent}%
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="px-4 pb-2 mt-auto text-center">
                                            <p className="font-poetsen text-lg text-gray-800">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                }).format(product.price)}
                                            </p>
                                        </div>

                                        <div className="text-sm text-gray-500 pb-3 text-center">
                                            <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                                            <p>⭐ {product.rating} ({product.reviews_count} reviews)</p>
                                        </div>
                                        <div className="px-4 pb-4 mt-auto flex justify-center gap-2">
                                            <Link
                                                to={`/gear/${product.id}`}
                                                className="w-full text-center"
                                            >
                                                <Button
                                                    className="w-full h-[40px] relative text-sm"
                                                    onClick={() => setButtonLoadingID(product.id)}
                                                    disabled={buttonLoadingID === product.id}
                                                >
                                                    <span className={buttonLoadingID === product.id ? "invisible" : "visible"}>
                                                        Details
                                                    </span>
                                                    {(buttonLoadingID === product.id) && (
                                                        <span className="absolute inset-0 flex items-center justify-center gap-2">
                                                            <Loader className="animate-spin w-4 h-4" />
                                                            Loading...
                                                        </span>
                                                    )}
                                                </Button>
                                            </Link>

                                            <Button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="w-full h-[40px] relative text-sm"
                                                color="#22c55e"
                                                hoverColor="#16a34a"
                                                type="submit"
                                                disabled={(buttonLoadingID === product.id) || product.stock <= 0}
                                            >
                                                <span className={(buttonLoadingID === product.id) ? "invisible" : "visible"}>
                                                    Add to Cart
                                                </span>
                                                {(buttonLoadingID === product.id) && (
                                                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                                                        <Loader className="animate-spin w-4 h-4" />
                                                        Loading...
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                        {product.is_featured ? (
                                            <div className="absolute bg-yellow-600 text-white text-xs px-2 py-1 shadow rounded-br-md">
                                                ★ Featured
                                            </div>
                                        ) : null}
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
    )
};