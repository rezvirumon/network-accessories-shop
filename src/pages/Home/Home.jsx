import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaHeadphones, FaCamera, FaHome, FaTshirt } from 'react-icons/fa'; // Import more icons as needed
import { BsFillRouterFill } from 'react-icons/bs';

const iconMap = {
    Router: <BsFillRouterFill className="w-12 h-12 text-blue-500" />,
    Mobile: <FaMobileAlt className="w-12 h-12 text-blue-500" />,
    Tablets: <FaTabletAlt className="w-12 h-12 text-blue-500" />,
    Accessories: <FaHeadphones className="w-12 h-12 text-blue-500" />,
    Cameras: <FaCamera className="w-12 h-12 text-blue-500" />,
    Home: <FaHome className="w-12 h-12 text-blue-500" />,
    Clothing: <FaTshirt className="w-12 h-12 text-blue-500" />,
    Laptop: <FaLaptop className="w-12 h-12 text-blue-500" />,
    // Add more category-to-icon mappings as needed
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                const products = response.data;

                // Extract unique categories from products
                const uniqueCategories = [...new Set(products.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                const errorMessage = error.response
                    ? error.response.data.message
                    : 'Error fetching categories. Please try again later.';
                console.error('Error fetching categories:', errorMessage, error);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

    return (
        <div className="p-6">
            {/* Hero Banner */}
            <div className="bg-blue-500 text-white p-12 text-center mb-6 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">Welcome to Our Store!</h1>
                <p className="mt-2 text-lg">Discover the best products at amazing prices.</p>
                <Link to="/shop" className="mt-4 inline-block bg-white text-blue-500 py-2 px-4 rounded shadow hover:bg-gray-100">
                    Shop Now
                </Link>
            </div>

            {/* Categories */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <Link key={category} to={`/category/${category}`} className="block">
                                <div className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-center">
                                    <div className="mb-4 flex justify-center">
                                        {iconMap[category] || <BsFillRouterFill className="w-12 h-12 text-blue-500" />} {/* Default icon if category not found */}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-lg">No categories available.</p>
                    )}
                </div>
            </section>

            {/* Promotions */}
            <section className="bg-yellow-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Current Promotions</h2>
                <p>Check out our latest offers and discounts. Limited time only!</p>
            </section>
        </div>
    );
};

export default Home;
