import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const CategoryProducts = () => {
    const { categoryId } = useParams();  // Get categoryId from URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        console.log("Category ID:", categoryId); // Debugging line
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/category/${categoryId}`);
                console.log("Fetched Products:", response.data); // Debugging line
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products by category:', error);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchProductsByCategory();
        }
    }, [categoryId]);

    if (loading) return <p className="text-center text-lg">Loading products...</p>;
    if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Products in Category</h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="w-[350px]  bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow">
                            <Link to={`/products/${product._id}`} className="block p-4">
                                <img
                                    src={product.images[0] || '/default-product-image.jpg'}
                                    alt={product.name}
                                    className="object-contain mx-auto h-[250px] w-full transition-transform transform hover:scale-105"
                                />
                                <h2 className="text-xl font-semibold h-10  mb-5 text-blue-600">{product.name}</h2>
                            <p className="text-sm mb-2 h-20">
                                {isExpanded ? product.description : product.description.slice(0, 70)}
                                {product.description.length > 50 && (
                                    <span
                                        className="text-blue-500 cursor-pointer ml-1"
                                        onClick={toggleReadMore}
                                    >
                                        {isExpanded ? ' Show Less' : '...Read More'}
                                    </span>
                                )}
                            </p>
                                <div className='flex justify-between items-center'>
                                <p className="text-lg font-bold text-blue-600 mb-2 flex items-center">
                                    Price:{product.price.toFixed(2)}<FaBangladeshiTakaSign></FaBangladeshiTakaSign>
                                </p>
                                <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                                </p>
                            </div>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-3 w-full">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg">No products found in this category.</p>
            )}
        </div>
    );
};

export default CategoryProducts;
