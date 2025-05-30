//Thuc
import React, { useState, useEffect } from "react";
import { CheckCircle2, Heart, Loader } from 'lucide-react';
import { Link } from "react-router-dom";
import { useModal } from '../../../Appwrapper';
import axios from "axios";

export default function ContentPetDetail({ pet }) {
    const [activeTab, setActiveTab] = useState('About');
    const { closeModal } = useModal();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`https://thoriumstudio.xyz/api/favorite/${pet.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(res => {
            setIsFavorite(res.data.is_favorite === true);
            console.log('Favorite pets fetched:', res.data);
        }).catch(err => {
            console.error('Error fetching favorites:', err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const toggleFavorite = (petId) => {
        setLoading(true);
        axios.post(`https://thoriumstudio.xyz/api/favorite/${petId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(() => {
            setIsFavorite(!isFavorite);
            console.log(`Pet ${petId} favorite status toggled.`);
        }).catch(err => {
            console.error('Failed to toggle favorite:', err);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="text-left text-sm w-full text-gray-700">
            <div className="mb-4 border-b border-gray-200 pb-3">
                <p className="text-xs text-gray-500">
                    <span
                        className={`px-2 py-1 rounded text-xs mr-1 font-medium ${pet.type === 'Dogs' ? 'bg-yellow-100 text-yellow-800'
                            : pet.type === 'Cats' ? 'bg-purple-100 text-purple-800'
                                : pet.type === 'Rodents' ? 'bg-green-100 text-green-800'
                                    : pet.type === 'Reptiles' ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {pet.breed}
                    </span>
                    <span
                        className={`px-2 py-1 rounded text-xs inline-block font-medium mr-1 bg-green-100 text-green-800`}
                    >
                        {pet.age}
                    </span>
                    <span
                        className={`px-2 py-1 rounded text-xs inline-block mr-1 font-medium ${pet.gender === 'Male'
                            ? 'bg-blue-100 text-blue-800'
                            : pet.gender === 'Female'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
                    </span>
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-3 shadow">
                        <img src={pet.main_image} alt={pet.name} className="object-cover w-full h-full" onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="text-xs italic text-gray-400">No Image</span>'; }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {pet.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2 mb-2 font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    <div className="mb-4 border-b border-gray-200 flex">
                        <button
                            onClick={() => setActiveTab('About')}
                            className={`py-2 px-5 text-sm font-medium transition-colors duration-150 ${activeTab === 'About'
                                ? 'text-customPurple border-b-2 border-customPurple'
                                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
                                }`} >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab('Details')}
                            className={`py-2 px-5 text-sm font-medium transition-colors duration-150 ${activeTab === 'Details'
                                ? 'text-customPurple border-b-2 border-customPurple'
                                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
                                }`} >
                            Details
                        </button>
                    </div>

                    <div className="min-h-[120px] text-xs mb-4">
                        {activeTab === 'About' && (
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1 text-sm">Description</h4>
                                <p className="text-gray-600 text-sm">{pet.description}</p>
                                <h4 className="font-semibold text-gray-800 mt-3 mb-1 text-sm">Adoption Fee</h4>
                                <p className="text-gray-600 text-sm">{pet.adoptionFee}</p>
                            </div>
                        )}
                        {activeTab === 'Details' && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                                <div className="font-semibold text-gray-800">Type:</div><div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${pet.type === 'Dogs' ? 'bg-yellow-100 text-yellow-800'
                                            : pet.type === 'Cats' ? 'bg-purple-100 text-purple-800'
                                                : pet.type === 'Rodents' ? 'bg-green-100 text-green-800'
                                                    : pet.type === 'Reptiles' ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {pet.type}
                                    </span>
                                </div>
                                <div className="font-semibold text-gray-800">Breed:</div><div className="text-gray-600">{pet.breed}</div>
                                <div className="font-semibold text-gray-800">Age:</div><div className="text-gray-600">{pet.age}</div>
                                <div className="font-semibold text-gray-800">Gender:</div><div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs inline-block ${pet.gender === 'Male'
                                            ? 'bg-blue-100 text-blue-800'
                                            : pet.gender === 'Female'
                                                ? 'bg-pink-100 text-pink-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
                                    </span>
                                </div>
                                <div className="font-semibold text-gray-800">Weight:</div><div className="text-gray-600">{pet.weight}</div>
                                <div className="font-semibold text-gray-800">Color:</div><div className="text-gray-600">{pet.color}</div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Health & Care</h4>
                        <ul className="space-y-1.5 text-sm text-gray-600">
                            <li className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 flex-shrink-0" />
                                Regular check-ups and vaccinations
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 flex-shrink-0" />
                                Microchipped for identification
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 flex-shrink-0" />
                                Proper diet and exercise recommended
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200 flex flex-wrap justify-end items-center gap-3">
                <button
                    onClick={() => toggleFavorite(pet.id)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    title="Save this pet"
                    className={`p-2 border rounded-md transition flex items-center justify-center
    ${isFavorite
                            ? "border-red-300 bg-red-100 text-red-600 hover:bg-red-200"
                            : "border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
  `}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                        <Heart className="w-5 h-5" />
                    )}
                </button>

                <Link to={`/pet/${pet.id}`} onClick={closeModal} className="py-2 px-4 bg-customPurple text-white text-sm rounded-md hover:bg-customPurpleDark transition font-medium">
                    Adopt Me
                </Link>
            </div>
        </div>
    );
}