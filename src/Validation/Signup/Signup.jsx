import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config'; // Firebase auth should be configured
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for backend requests

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Post user data to backend
            await axios.post('http://localhost:3001/api/users', { // Use apiClient here
                uid: user.uid,
                name: name,
                email: email,
                role: 'User', // Default role
                status: 'Active' // Default status
            });
    
            navigate('/'); // Redirect after successful signup
        } catch (err) {
            console.error('Firebase Error:', err.response ? err.response.data : err.message); // Log detailed error
            setError('Failed to create an account.');
        }
    };
    
    

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-md">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignUp}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
