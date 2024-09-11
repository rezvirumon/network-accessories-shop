import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const AdminRoute = ({ element }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;



    return user && user.role === 'Admin' ? element : <Navigate to="/" />;
};

export default AdminRoute;
