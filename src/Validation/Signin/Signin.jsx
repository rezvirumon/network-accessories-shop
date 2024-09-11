import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config'; // Firebase auth should be configured
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect after successful login
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-md">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignIn}>
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
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default SignIn;
