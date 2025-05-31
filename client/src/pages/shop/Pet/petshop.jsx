//Thuc
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useModal } from '../../../Appwrapper';
import ContentPetDetail from './ContentPetDetail';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import toast, { Toaster } from "react-hot-toast";
import { motion } from 'framer-motion';

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

export default function OurPets() {
  const [pets, setPets] = useState([]);
  const [selectedType, setSelectedType] = useState('All Pets');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);

  const { openModal } = useModal();
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trimStart());
  };


  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast.error("Failed to fetch pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const dynamicPetTypes = useMemo(() => {
    const types = new Set(pets.map(p => p.type).filter(Boolean));
    return ['All Pets', ...Array.from(types).sort()];
  }, [pets]);

  const handleDetailsClick = (petID) => {
    const pet = pets.find(p => p.id === petID);
    if (!pet) return;
    openModal({
      title: `Details of ${pet.name}`,
      body:
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          <ContentPetDetail pet={pet} />
        </motion.div>,
    });
  };

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesType = selectedType === 'All Pets' || pet.type === selectedType;
      const nameMatch = pet.name && pet.name.toLowerCase().includes(searchQuery.toLowerCase());
      const breedMatch = pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || breedMatch;
      return matchesType && matchesSearch;
    });
  }, [pets, selectedType, searchQuery]);

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
        return <img src="https://img.icons8.com/?size=100&id=2740&format=png&color=000000" alt="All Pets" className="w-8 h-8" />;
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

  const showSwiper = filteredPets.length > 0;

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
      <div ref={topRef} className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">🐾 Find Your Perfect Pet</h1>
        <p className="text-gray-500 text-sm">Browse our selection of adorable pets looking for a loving home</p>
      </div>

      <div className="w-full flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search pets by name or breed"
          className="w-full max-w-lg px-5 py-3 text-sm rounded-full bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-customPurpleDark focus:outline-none placeholder-gray-400 transition"
        />
      </div>

      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {dynamicPetTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border text-xs font-medium transition-all duration-200
        ${selectedType === type
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

      <div>
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
              {filteredPets.map((pet) => (
                <SwiperSlide key={pet.id} className="!h-auto">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col justify-between h-full transform hover:scale-[1.015] transition duration-200">
                    <div>
                      <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                        {pet.main_image ? (
                          <img
                            src={
                              typeof pet.main_image === 'string'
                                ? pet.main_image
                                : pet.main_image?.url
                            }
                            alt={pet.name}
                            className="w-full h-full object-contain select-none pointer-events-none"
                            loading="lazy"
                            draggable={false}
                          />
                        ) : (
                          <span className="text-sm">No Image Available</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl  text-center truncate">{pet.name}</h2>
                        <p className="text-sm text-gray-500 text-center capitalize">{pet.breed} • {pet.age}</p>
                        <p className="text-sm mt-2 text-gray-600 text-center line-clamp-2 min-h-[3.5rem]">{pet.description}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 mt-auto flex justify-center gap-2">
                      <Button
                        onClick={() => handleDetailsClick(pet.id)}
                        className="py-2 px-4 text-sm rounded-md w-full"
                      >
                        Details
                      </Button>
                      <Link
                        to={`/pet/${pet.id}`}
                        className="py-2 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition w-full text-center"
                      >
                        Adopt Me
                      </Link>
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
          <p className="text-gray-500 text-center py-10">No pets found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}