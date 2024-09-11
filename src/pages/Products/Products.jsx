import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Products List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/products/${product._id}`} className="block p-4"> {/* Link to product details */}
                        <img
                            src={product.images[0]} // Display the first image
                            alt={product.name}
                            className="w-full h-64 object-cover mb-4 rounded-md"
                        />
                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                        <p className="mb-2">{product.description}</p>
                        <p className="text-lg font-bold  mb-2">
                            Price: TK/{product.price.toFixed(2)}
                        </p>
                        <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                        </p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-3 w-full">
                            View Details
                        </button>
                    </Link>
                </div>
            ))}
        </div>
        </div>
    );
};

export default Products;
