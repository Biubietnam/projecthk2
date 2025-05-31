import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Button from '../../components/Button';
import { useModal } from '../../Appwrapper';
import ContentPetDetail from '../shop/Pet/ContentPetDetail';
import ReviewUnreviewedProducts from '../User/ReviewUnreviewedProducts';


export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: '', gender: '', date_of_birth: '', phone: '',
    address: '', city: '', country: '', avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef();
  const [favoritePets, setFavoritePets] = useState([]);
  const { openModal } = useModal();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://localhost:8000/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritePets(res.data || []);
      } catch (err) {
        console.error("Error fetching favorite pets:", err);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://localhost:8000/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile data:', res.data);
        console.log('Profile ID:', res.data.user_id);
        if (res.data && isMounted) setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDetailsClick = (petID) => {
    const pet = favoritePets.find(p => p.id === petID);
    if (!pet) return;
    openModal({
      title: `Details of ${pet.name}`,
      body: <ContentPetDetail pet={pet} />,
    });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", "petzone");
    formData.set("folder", `Petzone/Users/${profile.user_id}/Avatar`);
    const res = await axios.post("https://api.cloudinary.com/v1_1/dpwlgnop6/image/upload", formData);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (avatarFile) {
        profile.avatar_url = await uploadToCloudinary(avatarFile);
      }
      await axios.put(`http://localhost:8000/api/user/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('❌ Failed to update profile.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 space-y-6 mt-10">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative group w-28 h-28 mx-auto sm:mx-0">
            <img
              src={avatarPreview || (typeof profile.avatar_url === 'string' ? profile.avatar_url : profile.avatar_url?.url) || 'https://ui-avatars.com/api/?name=User'}
              className="w-28 h-28 rounded-full object-cover border shadow-sm group-hover:brightness-90 transition"
              alt="Avatar"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition"
              title="Change Avatar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <FloatingInput label="Full Name" name="full_name" value={profile.full_name} onChange={handleChange} required />
            <FloatingSelect label="Gender" name="gender" value={profile.gender} onChange={handleChange} required
              options={[{ value: '', label: 'Select Gender' }, { value: 'Male', label: '♂ Male' }, { value: 'Female', label: '♀ Female' }, { value: 'Other', label: 'Other' }]} />
            <FloatingInput label="Date of Birth" name="date_of_birth" type="date" value={profile.date_of_birth} onChange={handleChange} required />
            <FloatingInput label="Phone" name="phone" value={profile.phone} onChange={handleChange} required />
            <FloatingInput label="Address" name="address" value={profile.address} onChange={handleChange} />
            <FloatingInput label="City" name="city" value={profile.city} onChange={handleChange} />
            <FloatingInput label="Country" name="country" value={profile.country} onChange={handleChange} />
          </form>
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            type="submit"
            className={`mt-4 px-6 py-2 rounded-xl text-white text-sm shadow-sm transition ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
            disabled={submitting}
          >
            {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Update Profile'}
          </Button>
        </div>
      </div>

      {favoritePets.length > 0 && (
        <div className="w-full max-w-5xl mt-12">
          <h2 className="text-xl mb-6 font-semibold">🐾 Favorite Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoritePets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => handleDetailsClick(pet.id)}
                className="cursor-pointer bg-white p-4 border border-gray-100 rounded-2xl shadow hover:shadow-md transition"
              >
                <img
                  src={typeof pet.main_image === 'string' ? pet.main_image : pet.main_image?.url || "https://via.placeholder.com/150"}
                  alt={pet.name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <div className="text-center">
                  <h3 className="text-base">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ReviewUnreviewedProducts openModal={openModal} />
    </div>
  );
}

function FloatingInput({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div className="relative min-h-[72px]">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="peer w-full px-4 pt-7 pb-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder=" "
      />
      <label className="absolute text-gray-500 text-sm left-4 top-2.5 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ label, name, value, onChange, required = false, options = [] }) {
  return (
    <div className="relative min-h-[72px]">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="peer w-full px-4 pt-7 pb-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label className="absolute text-gray-500 text-sm left-4 top-2.5 transition-all peer-focus:top-2.5 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );
}
