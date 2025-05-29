import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Button from '../../components/Button';

export default function Profile({ id }) {
    const [profile, setProfile] = useState({
        full_name: '', gender: '', date_of_birth: '', phone: '',
        address: '', city: '', country: '', avatar_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const user = localStorage.getItem('user_info');
    const userID = user ? JSON.parse(user).id : id;
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarInputRef = useRef();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token || !userID) return;
                const res = await axios.get(`http://localhost:8000/api/user/${userID}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data && isMounted) setProfile(res.data.profile);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProfile();
        return () => { isMounted = false };
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("upload_preset", "petzone");
        formData.set("folder", `Petzone/Users/${id}/Avatar`);
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
            await axios.put(`http://localhost:8000/api/user/${userID}/profile`, profile, {
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
        <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-800">
            <div className="bg-white max-w-4xl mx-auto rounded-2xl shadow-lg p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative w-28 h-28">
                        <img
                            src={avatarPreview || profile.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full shadow border"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={avatarInputRef}
                            onChange={handleAvatarChange}
                        />
                        <div
                            onClick={() => avatarInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-blue-600 hover:text-white transition"
                            title="Change avatar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                        </div>
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

                <div className="mt-8 text-center">
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        className={`px-6 py-2 rounded-lg text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={submitting}
                    >
                        {submitting ? <Loader className="animate-spin w-5 h-5" /> : 'Update Profile'}
                    </Button>
                </div>
            </div>
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
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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

