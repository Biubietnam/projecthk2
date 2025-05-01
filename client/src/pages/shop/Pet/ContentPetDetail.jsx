//Thuc
import React, { useState } from "react";
import { CheckCircle2, Heart } from 'lucide-react';
import { Link } from "react-router-dom";
import { useModal } from '../../../Appwrapper';

export default function ContentPetDetail({ pet }) {
    const [activeTab, setActiveTab] = useState('About');
    const { closeModal } = useModal();

    const handleSaveClick = () => console.log(`Save clicked for ${pet.name}`);
    const handleScheduleClick = () => console.log(`Schedule clicked for ${pet.name}`);

    return (
        <div className="text-left text-sm w-full text-gray-700">
            <div className="mb-4 border-b border-gray-200 pb-3">
                <p className="text-xs text-gray-500">
                    {pet.breed} • {pet.age} • {pet.gender}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-3 shadow">
                        <img src={pet.image} alt={pet.name} className="object-cover w-full h-full" onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="text-xs italic text-gray-400">No Image</span>'; }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {pet.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium border border-gray-200">{tag}</span>
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
                                <div className="font-semibold text-gray-800">Breed:</div><div className="text-gray-600">{pet.breed}</div>
                                <div className="font-semibold text-gray-800">Age:</div><div className="text-gray-600">{pet.age}</div>
                                <div className="font-semibold text-gray-800">Gender:</div><div className="text-gray-600">{pet.gender}</div>
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
                    onClick={handleSaveClick}
                    title="Save this pet"
                    className="p-2 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-700 transition"
                >
                    <Heart className="w-5 h-5" />
                </button>
                <button
                    onClick={handleScheduleClick}
                    className="py-2 px-4 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200 border border-gray-200 transition font-medium"
                >
                    Schedule Appointment
                </button>
                <Link to={`/pet/${pet.id}`} onClick={closeModal} className="py-2 px-4 bg-customPurple text-white text-sm rounded-md hover:bg-customPurpleDark transition font-medium">
                    Adopt Me
                </Link>
            </div>
        </div>
    );
}