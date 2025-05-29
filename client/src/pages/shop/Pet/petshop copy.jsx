//Thuc
import React, { useState, useEffect, useMemo } from 'react';
import { useModal } from '../../../Appwrapper';
import ContentPetDetail from './ContentPetDetail';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import Button from '../../../components/Button';

export default function OurPets() {
  const [pets, setPets] = useState([]);
  const [selectedType, setSelectedType] = useState('All Pets');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { openModal } = useModal();

  useEffect(() => {
    setLoading(true);
    axios.get('https://thoriumstudio.xyz/api/pets')
      .then(response => setPets(response.data))
      .catch(error => console.error('Error fetching pets:', error))
      .finally(() => setLoading(false));
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
      body: <ContentPetDetail pet={pet} />,
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
      <div className="text-center mb-10">
        <h1 className="text-4xl mb-2  font-poetsen flex items-center justify-center gap-2 animate-fade-in">
          🐾 Find Your Perfect Pet
        </h1>
        <p className="text-gray-600 mt-2">Browse our selection of adorable pets looking for a loving home</p>
      </div>

      <div className="flex flex-col items-center gap-6 mb-10">
        <input
          type="text"
          placeholder="Search by name or breed..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-customPurple text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search pets by name or breed"
        />

        <div className="flex justify-center gap-4 flex-wrap">
          {dynamicPetTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border text-sm transition
      ${selectedType === type
                  ? "bg-customPurple text-white border-customPurple"
                  : "bg-white text-gray-700 border-gray-300 hover:border-customPurple"
                }`}
              aria-label={`Filter pets by ${type}`}
            >
              {getTypeIcon(type)}
              <span className="mt-1">{type}</span>
            </button>
          ))}
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
                1280: { slidesPerView: 3, spaceBetween: 30 },
                1536: { slidesPerView: 3, spaceBetween: 30 },
                1920: { slidesPerView: 3, spaceBetween: 30 },
              }}
            >
              {filteredPets.map((pet) => (
                <SwiperSlide key={pet.id} className="h-auto">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">
                    <div>
                      <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                        {pet.main_image ? (
                          <img
                            src={pet.main_image}
                            alt={pet.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-sm">No Image Available</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl  text-center truncate">{pet.name}</h2>
                        <p className="text-sm text-gray-500 text-center capitalize">{pet.breed} • {pet.age}</p>
                        <p className="text-sm mt-2 text-gray-600 text-center line-clamp-2">{pet.description}</p>
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