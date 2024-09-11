import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Firebase User:', firebaseUser); // Log the firebaseUser
            if (firebaseUser) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/users/${firebaseUser.uid}`);
                    console.log('API Response:', response.data); // Log the API response
                    if (response.data) {
                        setUser({ ...firebaseUser, role: response.data.role });
                    } else {
                        console.error('No user data found');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        }, (error) => {
            console.error('Auth Error:', error);
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
