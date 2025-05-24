//Thuc
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useModal } from '../../../Appwrapper';
import AdoptForm from './AdoptForm';

export default function PetAdoptionPage() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('About');
    const { openModal } = useModal();
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const petRes = await axios.get(`http://localhost:8000/api/pets/${id}`);
                setPet(petRes.data);

                const token = localStorage.getItem("access_token");
                if (token) {
                    const adoptionRes = await axios.get(`http://localhost:8000/api/adoption/check/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setHasPending(adoptionRes.data.has_request);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleAdoptClick = () => {
        if (!pet) return;
        openModal({
            title: `Adopt ${pet.name}`,
            body: <AdoptForm pet={pet} />,
        });
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Dogs':
                return 'bg-yellow-600';
            case 'Cats':
                return 'bg-pink-600';
            case 'Rodents':
                return 'bg-orange-600';
            case 'Reptiles':
                return 'bg-green-600';
            default:
                return 'bg-gray-600';
        }
    };

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
            <div className="mb-2">
                <Link
                    to="/petshop"
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

                    Back to Pet Shop
                </Link>
            </div >

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">

                <div className="w-full lg:w-3/5 bg-white p-6 rounded-lg">
                    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden">
                        {pet?.images?.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={10}
                                slidesPerView={1}
                                className="w-full"
                            >
                                {pet.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="h-[34rem] aspect-[3/4] flex items-center justify-center bg-white rounded-xl overflow-hidden mx-auto">
                                            <img
                                                src={img}
                                                alt={`Pet - ${pet.name || "Product"} - ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
                                No images available
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl ">{pet.name}</h1>
                        <span className={`text-sm text-white px-3 py-1 rounded ${getTypeColor(pet.type)}`}>
                            {pet.type}
                        </span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            {pet.tags.includes('Available') ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <div className="flex gap-3 mb-4 border-b">
                        {['About', 'Details', 'Care Information'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-4 text-sm font-medium ${activeTab === tab
                                    ? 'text-customPurple border-b-2 border-customPurple'
                                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div>
                        {activeTab === 'About' && (
                            <div>
                                <p className="text-gray-600 mb-3">{pet.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {pet.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-gray-100 border px-3 py-1 rounded-full font-medium text-gray-700"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Details' && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Breed</p>
                                    <p className="tex-gray-700 text-lg">{pet.breed}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Age</p>
                                    <p className="tex-gray-700 text-lg">{pet.age}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Weight</p>
                                    <p className="tex-gray-700 text-lg">{pet.weight}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Color</p>
                                    <p className="tex-gray-700 text-lg">{pet.color}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Gender</p>
                                    <span
                                        className={`px-2 py-1 rounded inline-block mr-1 font-medium ${pet.gender === 'Male'
                                            ? 'bg-blue-100 text-blue-800'
                                            : pet.gender === 'Female'
                                                ? 'bg-pink-100 text-pink-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Care Information' && (
                            <div className="text-sm text-gray-700 space-y-4">
                                <div>
                                    <h3 className="tex-gray-700 text-xl">Diet</h3>
                                    <p className="text-gray-500">{pet.careDiet}</p>
                                </div>
                                <div>
                                    <h3 className="tex-gray-700 text-xl">Exercise</h3>
                                    <p className="text-gray-500">{pet.careExercise}</p>
                                </div>
                                <div>
                                    <h3 className="tex-gray-700 text-xl">Grooming</h3>
                                    <p className="text-gray-500">{pet.careGrooming}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Adoption Fee</h2>
                        <p className="font-poetsen text-3xl text-gray-800">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(pet.adoptionFee)}
                        </p>
                        <p className="text-xs text-gray-500 m-2">Fee includes vaccinations, microchip, and spay/neuter</p>
                    </div>
                    {hasPending ? (
                        <div className="w-full py-3 px-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow-inner">
                            <img src="https://img.icons8.com/?size=100&id=lr6SW2hyT2rh&format=png&color=000000" alt="Pending" className='w-10 h-10 mx-auto' />
                            You have already submitted an adoption request.
                        </div>
                    ) : (
                        <button
                            onClick={handleAdoptClick}
                            className="w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 bg-green-500 rounded-lg shadow-lg group hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-green-600 opacity-10 group-hover:opacity-20"></span>
                            <span className="relative z-10">🐾 Adopt Me</span>
                        </button>
                    )}
                    <div className="mt-6 text-center">
                        <h2 className="text-xl mb-2">Need Help?</h2>
                        <Link to="/contact">
                            <Button>
                                <img src="https://img.icons8.com/?size=100&id=fUHYOFprDglQ&format=png&color=000000" alt="Contact Us" className="inline-block mr-2 w-5 h-5" />
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
