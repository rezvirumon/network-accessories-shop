import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth'; // Correct path to useAuth
import axios from 'axios';

const Profile = () => {
    const { user, loading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        photoURL: '',
        mobile: '',
        address: '' // New field for delivery address
    });
    const [error, setError] = useState('');

    // Fetch profile data when user changes
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/users/${user.uid}`)
                .then(response => {
                    setProfile(response.data);
                    setFormData({
                        name: response.data.name || '',
                        photoURL: response.data.photoURL || '',
                        mobile: response.data.mobile || '',
                        deliveryAddress: response.data.deliveryAddress || '' // Fetch the deliveryAddress
                    });
                })
                .catch(error => console.error('Error fetching user profile:', error));
        }
    }, [user]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.photoURL.match(/^https?:\/\/.+$/)) {
            setError('Invalid photo URL');
            return;
        }

        axios.put(`http://localhost:3001/api/users/${user.uid}`, formData)
            .then(response => {
                setProfile(response.data);
                setEditing(false);
            })
            .catch(error => {
                setError('Error updating profile');
            });
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">Not logged in</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-base-200 shadow-md rounded-lg">
            <div className="text-center">
                <h1 className="text-3xl font-semibold mb-4">Welcome, {profile?.name}</h1>
                <div className="mb-6">
                    <img
                        src={profile?.photoURL || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                    />
                </div>
            </div>
            {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo URL:</label>
                        <input
                            type="text"
                            name="photoURL"
                            value={formData.photoURL}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile:</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery Address:</label>
                        <input
                            type="text"
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </form>
            ) : (
                <div className="text-center">
                    <span className='badge bg-green-600 text-white font-semibold'>{profile?.status}</span>
                    <p className="text-lg font-medium">Name: {profile?.name}</p>
                    <p className="text-lg font-medium">Mobile: {profile?.mobile}</p>
                    <p className="text-lg font-medium">Delivery Address: {profile?.deliveryAddress}</p>
                    <button
                        onClick={() => setEditing(true)}
                        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
