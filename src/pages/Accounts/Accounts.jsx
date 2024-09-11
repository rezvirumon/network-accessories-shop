import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ role: '', status: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/users')
            .then(response => {
                setAccounts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = (uid) => {
        axios.patch(`http://localhost:3001/api/users/${uid}`, formData)
            .then(response => {
                setAccounts(prevAccounts =>
                    prevAccounts.map(account =>
                        account.uid === uid ? response.data : account
                    )
                );
                setEditing(null);
                setError('');
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setError('Error updating user');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5 text-center">
            <h1 className="text-3xl font-bold mb-5">Accounts List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div key={account.uid} className="border p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <img src={account.photoURL} alt=""  className='rounded-full w-24 mx-auto'/>
                        <h2 className="text-xl font-bold mb-2">{account.name}</h2>
                        <p className="text-gray-600 mb-2">{account.email}</p>
                        <p className="text-lg font-bold mb-2">
                            Balance: ${account.balance ? account.balance.toFixed(2) : 'N/A'}
                        </p>
                        <p className="font-semibold mb-2">
                            Role: <span className={account.role === 'Admin' ? 'text-blue-600' : 'text-gray-700'}>{account.role}</span>
                        </p>
                        <p className={`font-semibold ${account.status === 'Active' ? 'text-green-600' : 'text-red-600'} mb-4`}>
                            {account.status}
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setEditing(account.uid)}
                                className="bg-gray-500 mx-auto hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Manage Account
                            </button>
                        </div>
                        {editing === account.uid && (
                            <div className="mt-4">
                                <div className="mb-2">
                                    <label htmlFor="role" className="block font-semibold mb-1">Role:</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Moderator">Moderator</option>
                                        <option value="User">User</option>
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="status" className="block font-semibold mb-1">Status:</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => handleUpdate(account.uid)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                                >
                                    Update
                                </button>
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
