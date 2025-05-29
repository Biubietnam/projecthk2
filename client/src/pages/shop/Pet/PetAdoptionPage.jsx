// PetAdoptionPage.jsx - Apple-style UI/UX
import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { useModal } from '../../../Appwrapper';
import Button from '../../../components/Button';
import AdoptForm from './AdoptForm';
import { Mail } from 'lucide-react';
import _ from 'lodash';

export default function PetAdoptionPage() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('About');
    const { openModal } = useModal();
    const [hasPending, setHasPending] = useState(false);
    const [suggestedGear, setSuggestedGear] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const petRes = await axios.get(`http://localhost:8000/api/pets/${id}`);
                setPet(petRes.data);

                const gearRes = await axios.get(`http://localhost:8000/api/gears`);
                const dogGears = gearRes.data.filter(item => item.petType === 'Dogs');

                let featured = _.shuffle(dogGears.filter(item => item.is_featured));
                if (featured.length < 2) {
                    const rest = _.shuffle(dogGears.filter(item => !item.is_featured));
                    featured = [...featured, ...rest.slice(0, 2 - featured.length)];
                }
                setSuggestedGear(featured.slice(0, 2));

                const token = localStorage.getItem("access_token");
                if (token) {
                    const adoptionRes = await axios.get(`http://localhost:8000/api/adoption/check/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const petRes = await axios.get(`http://localhost:8000/api/pets/${id}`);
                setPet(petRes.data);
                const token = localStorage.getItem("access_token");
                if (token) {
                    const adoptionRes = await axios.get(`http://localhost:8000/api/adoption/check/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setHasPending(adoptionRes.data.has_request);
                }
            } catch (err) {
                console.error("Error fetching pet data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAdoptClick = () => {
        if (!pet) return;
        openModal({ title: `Adopt ${pet.name}`, body: <AdoptForm pet={pet} /> });
    };

    const getTypeColor = (type) => {
        const colors = {
            Dogs: 'bg-yellow-600',
            Cats: 'bg-pink-600',
            Rodents: 'bg-orange-600',
            Reptiles: 'bg-green-600',
        };
        return colors[type] || 'bg-gray-600';
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0114.14 14.14A10 10 0 014.93 4.93z" />
                </svg>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <Breadcrumb />

            <div className="mt-6 flex flex-col lg:flex-row gap-10 items-stretch">
                {/* Left - Image and Tabs */}
                <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-xl">
                    <div className="rounded-xl overflow-hidden">
                        {pet.images?.length ? (
                            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={10} slidesPerView={1}>
                                {pet.images.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <motion.img
                                            src={img}
                                            alt={`Pet ${i}`}
                                            className="h-[34rem] w-full object-contain rounded-xl"
                                            loading="lazy"
                                            whileHover={{ scale: 1.02 }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : <div className="h-96 flex justify-center items-center bg-gray-100 text-gray-400">No images available</div>}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <h1 className="text-3xl font-semibold">{pet.name}</h1>
                        <span className={`text-sm text-white px-3 py-1 rounded-full ${getTypeColor(pet.type)}`}>{pet.type}</span>
                        <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full">
                            {pet.tags.includes('Available') ? 'Available' : 'Unavailable'}
                        </span>
                    </div>

                    <div className="flex gap-4 mt-6 border-b">
                        {['About', 'Details', 'Care Information'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`pb-2 text-sm font-semibold border-b-2 ${activeTab === tab ? 'border-customPurple text-customPurple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 text-sm">
                        {activeTab === 'About' && (
                            <>
                                <p className="mb-3 text-gray-600">{pet.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {pet.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 border px-3 py-1 rounded-full text-gray-700 font-medium">{tag}</span>)}
                                </div>
                            </>
                        )}
                        {activeTab === 'Details' && (
                            <div className="grid grid-cols-2 gap-4">
                                {[['Breed', pet.breed], ['Age', pet.age], ['Weight', pet.weight], ['Color', pet.color]].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-gray-500">{label}</p>
                                        <p className="text-lg text-gray-800 font-medium">{value}</p>
                                    </div>
                                ))}
                                <div>
                                    <p className="text-gray-500">Gender</p>
                                    <span className={`px-2 py-1 rounded-full font-medium ${pet.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                        {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
                                    </span>
                                </div>
                            </div>
                        )}
                        {activeTab === 'Care Information' && (
                            <div className="space-y-4">
                                {[['Diet', pet.careDiet], ['Exercise', pet.careExercise], ['Grooming', pet.careGrooming]].map(([title, value]) => (
                                    <div key={title}>
                                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                                        <p className="text-gray-600">{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right - Adoption Info */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full lg:w-2/5 bg-white p-6 rounded-2xl shadow-xl space-y-6 h-full"
                >

                    <div>
                        <h2 className="text-xl">Adoption Fee</h2>
                        <p className="font-poetsen text-3xl text-gray-800">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pet.adoptionFee)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Includes vaccinations, microchip, and spay/neuter</p>
                    </div>

                    {hasPending ? (
                        <div className="p-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
                            <img src="https://img.icons8.com/?size=100&id=lr6SW2hyT2rh&format=png&color=000000" alt="Pending" className="w-8 h-8 mx-auto mb-2" />
                            You already submitted a request.
                        </div>
                    ) : (
                        <Button onClick={handleAdoptClick} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg">
                            Adopt Me
                        </Button>
                    )}

                    <div className="text-center">
                        <h2 className="text-lg font-medium mb-2">Need Help?</h2>
                        <Link to="/contact">
                            <Button>
                                <Mail className="inline mr-2" />
                                Contact Us
                            </Button>
                        </Link>
                    </div>

                    {/* Suggested Gear */}
                    <div>
                        <h2 className="text-lg mt-6 mb-3">Recommended for Dogs</h2>
                        <ul className="space-y-4">
                            {suggestedGear.map(gear => (
                                <li key={gear.id} className="flex items-start gap-3 border p-3 rounded-lg">
                                    <img src={gear.main_image} alt={gear.name} className="w-16 h-16 object-contain rounded-lg" />
                                    <div className="flex-1">
                                        <Link to={`/gear/${gear.id}`} className="text-sm font-semibold text-customPurple hover:underline">
                                            {gear.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 line-clamp-2">{gear.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
}
