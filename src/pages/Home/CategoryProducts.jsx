import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const CategoryProducts = () => {
    const { categoryId } = useParams();  // Get categoryId from URL
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [priceRange, setPriceRange] = useState([1, 500000]);  // Default range from 1 to 500,000 Taka
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/category/${categoryId}`);
                setProducts(response.data);
                setFilteredProducts(response.data); // Initially display all products
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

    useEffect(() => {
        const filterProducts = () => {
            const [min, max] = priceRange;
            const filtered = products
                .filter(product =>
                    product.price >= min && product.price <= max &&
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [priceRange, products, searchQuery]);

    if (loading) return <p className="text-center text-lg">Loading products...</p>;
    if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

    const handleToggleReadMore = (productId) => {
        setExpandedProductId(expandedProductId === productId ? null : productId);
    };

    const handlePriceRangeChange = (event, index) => {
        const value = parseFloat(event.target.value);
        setPriceRange(prevRange => {
            const newRange = [...prevRange];
            newRange[index] = value;
            return newRange;
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Products in Category</h1>

            <div className="rounded-2xl p-5 bg-gray-800 shadow-xl mb-10">
                <div className='lg:flex justify-between items-center'>
                    <div className="mt-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by product name"
                            className="input input-bordered input-accent w-full max-w-xs"
                        />
                    </div>
                    <div className="flex flex-col items-center lg:w-3/6">
                        <h2 className="mt-5 lg:mt-0 lg:text-xl font-semibold mb-2">Filter by Price Range</h2>
                        <input
                            type="range"
                            min={1}
                            max={500000}
                            step={1000}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(e, 0)}
                            className="range range-error mb-4"
                        />
                        <input
                            type="range"
                            min={1}
                            max={500000}
                            step={1000}
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(e, 1)}
                            className="range range-success"
                        />
                        <div className="flex justify-between text-sm mt-2 w-full">
                            <span>Min: {priceRange[0].toLocaleString()} Taka</span>
                            <span>Max: {priceRange[1].toLocaleString()} Taka</span>
                        </div>
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="w-[350px] bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow">
                            <Link to={`/products/${product._id}`} className="block p-4">
                                <img
                                    src={product.images[0] || '/default-product-image.jpg'}
                                    alt={product.name}
                                    className="object-contain mx-auto h-[250px] w-full transition-transform transform hover:scale-105"
                                />
                                <h2 className="text-xl font-semibold h-10 mb-5 text-blue-600">{product.name}</h2>
                                <p className="text-sm mb-2 h-20">
                                    {expandedProductId === product._id ? product.description : product.description.slice(0, 70)}
                                    {product.description.length > 70 && (
                                        <span
                                            className="text-blue-500 cursor-pointer ml-1"
                                            onClick={() => handleToggleReadMore(product._id)}
                                        >
                                            {expandedProductId === product._id ? ' Show Less' : '...Read More'}
                                        </span>
                                    )}
                                </p>
                                <div className='flex justify-between items-center'>
                                    <p className="text-lg font-bold text-blue-600 mb-2 flex items-center">
                                        Price: {product.price.toFixed(2)}<FaBangladeshiTakaSign />
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
                <p className="text-center text-lg">No products found in this category within the selected price range.</p>
            )}
        </div>
    );
};

export default CategoryProducts;
