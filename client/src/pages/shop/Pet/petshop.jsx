//Thuc
import React, { useState, useEffect, useMemo } from 'react';
import { useModal } from '../../../Appwrapper';
import ContentPetDetail from './ContentPetDetail';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function OurPets() {
  const [pets, setPets] = useState([]);
  const [selectedType, setSelectedType] = useState('All Pets');
  const [searchQuery, setSearchQuery] = useState('');

  const { openModal } = useModal();

  useEffect(() => {
    axios.get('http://localhost:8000/api/pets')
      .then(response => setPets(response.data))
      .catch(error => console.error('Error fetching pets:', error));
  }, []);

  const dynamicPetTypes = useMemo(() => {
    const types = new Set(pets.map(p => p.type));
    return ['All Pets', ...Array.from(types).sort()];
  }, [pets]);

  const handleDetailsClick = (petName) => {
    const pet = pets.find(p => p.name === petName);
    if (!pet) return;
    openModal({
      title: `Details of ${pet.name}`,
      body: <ContentPetDetail pet={pet} />,
    });
  };

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesType = selectedType === 'All Pets' || pet.type === selectedType;
      const matchesSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [pets, selectedType, searchQuery]);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold">Find Your Perfect Pet</h1>
        <p className="text-gray-600 mt-2">Browse our selection of adorable pets looking for a loving home</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by name or breed..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-customPurple text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search pets by name or breed"
        />
        <select
          className="px-4 py-2 rounded-md border border-customPurple text-sm"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          aria-label="Filter pets by type"
        >
          {dynamicPetTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white border border-customPurple rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">
              <div>
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  <span className="text-sm">Image Placeholder</span>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-center">{pet.name}</h2>
                  <p className="text-sm text-gray-500 text-center">{pet.breed} • {pet.age}</p>
                  <p className="text-sm mt-2 text-gray-600 text-center">{pet.description}</p>
                </div>
              </div>

              <div className="px-4 pb-4 mt-auto flex justify-center gap-2">
                <button
                  onClick={() => handleDetailsClick(pet.name)}
                  className="py-2 px-4 bg-customPurple text-white text-sm rounded-md hover:bg-customPurpleDark transition w-full"
                  aria-label={`View details for ${pet.name}`}
                >
                  Details
                </button>
                <Link to={`/pet/${pet.id}`} className="py-2 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition w-full text-center" aria-label={`Adopt ${pet.name}`}>
                  Adopt Me
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No pets found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
