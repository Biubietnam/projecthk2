//Thuc
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export default function PetAdoptionPage() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('About');

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:8002/api/pets/${id}`);
                setPet(response.data);
            } catch (error) {
                console.error("Error fetching pet:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    if (loading) return <p className="text-center">Loading...</p>;
    if (!pet) return <p className="text-center text-red-600">Pet not found.</p>;

    return (
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
                <div className="flex-1 bg-white p-6 rounded-lg">
                    <div className="w-full h-80 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400">Image Placeholder</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-bold">{pet.name}</h1>
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

                <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Adoption Fee</h2>
                        <p className="font-poetsen text-3xl text-gray-800">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(pet.adoptionFee)}
                        </p>
                        <p className="text-xs text-gray-500">Fee includes vaccinations, microchip, and spay/neuter</p>
                    </div>
                    <Button className="w-full">Adopt Me</Button>
                    <button className="w-full bg-white text-gray-600 py-2 rounded-md hover:bg-gray-300 transition duration-200 border border-customPurple">
                        Schedule a Visit
                    </button>
                    <div className="mt-6">
                        <h2 className='text-xl'>Contact Us</h2>
                        <p className="text-sm text-gray-500">Phone: (123) 456-7890</p>
                        <p className="text-sm text-gray-500">Email: adoptions@petcare.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
