//Thuc
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
    const [profile, setProfile] = useState({
        full_name: '',
        gender: '',
        date_of_birth: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        avatar_url: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get('http://localhost:8002/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data) setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = e => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            await axios.put('http://localhost:8002/api/profile', profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="max-w-xl mx-auto px-4 py-10 shadow rounded hover:shadow-lg transition-shadow duration-300 bg-white">
                <h2 className="text-xl font-bold mb-4">User Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="full_name" placeholder="Full Name" value={profile.full_name || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <select name="gender" value={profile.gender || ''} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Gender</option>
                        <option value="Male">♂ Male</option>
                        <option value="Female">♀ Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="phone" placeholder="Phone" value={profile.phone || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="address" placeholder="Address" value={profile.address || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="city" placeholder="City" value={profile.city || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="country" placeholder="Country" value={profile.country || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="avatar_url" placeholder="Avatar URL" value={profile.avatar_url || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}
