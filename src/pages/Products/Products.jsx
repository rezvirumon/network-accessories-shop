import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(15); // For Load More functionality
    const [imageIndexes, setImageIndexes] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
                setDisplayedProducts(response.data.slice(0, 15)); // Display first 15 products
                const uniqueCategories = [...new Set(response.data.map(product => product.category))];
                setCategories(uniqueCategories);

                // Initialize image indexes for each product
                const initialIndexes = {};
                response.data.forEach(product => {
                    initialIndexes[product._id] = 0;
                });
                setImageIndexes(initialIndexes);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Set up an interval to change images every 5 seconds for each product
        const intervals = products.map(product => {
            return setInterval(() => {
                setImageIndexes(prevIndexes => ({
                    ...prevIndexes,
                    [product._id]: (prevIndexes[product._id] + 1) % product.images.length
                }));
            }, 5000); // Change image every 5 seconds
        });

        // Clear intervals when component unmounts
        return () => {
            intervals.forEach(clearInterval);
        };
    }, [products]);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 15); // Load 15 more products
        setDisplayedProducts(products.slice(0, visibleCount + 15));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = displayedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-center text-lg">Loading products...</p>;
    if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

    return (
        <div className="p-5 container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Products List</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for products..."
                    className="w-full p-2 mb-4 border rounded"
                />
            </div>

            {/* Category Links */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
                <div className="flex flex-wrap gap-4 mb-6">
                    {categories.map(category => (
                        <Link
                            key={category}
                            to={`/category/${category}`}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Products Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product._id} className="w-[350px]  bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow">
                        <Link to={`/products/${product._id}`} className="block p-4">
                            <img
                                src={product.images[imageIndexes[product._id]] || '/default-product-image.jpg'}
                                alt={product.name}
                                className=" object-contain mx-auto h-[250px] "
                            />
                            <h2 className="text-xl font-semibold h-10  mb-5">{product.name}</h2>
                            <p className="text-sm  mb-2 h-20">{product.description}</p>
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

            {/* Load More Button */}
            {visibleCount < products.length && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-semibold"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
