import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { productData } from './Products';

const ProductsDetail = () => {
    const { id } = useParams();
    const product = productData.find((item) => item.id === parseInt(id));
    const [selectedImage, setSelectedImage] = useState(product?.images[0] || ''); // Placeholder if no images
    const [quantity, setQuantity] = useState(1); // Default quantity

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            return newQuantity > 0 && newQuantity <= product?.stock ? newQuantity : prevQuantity;
        });
    };

    if (!product) {
        return <div className="p-5">Product not found!</div>;
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">{product.name}</h1>
            
            <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* Main product image */}
                <div className="flex-1 flex justify-center">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full max-w-sm lg:w-96 lg:h-96 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
                    />
                </div>

                <div className="flex-1">
                    <p className="text-lg mb-3 text-gray-600">{product.description}</p>
                    <p className="text-2xl font-bold mb-3">Price: ${product.price.toFixed(2)}</p>
                    <p className="text-md font-semibold mb-3">
                        Category: <span className="text-gray-700">{product.category}</span>
                    </p>
                    <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'} mb-4`}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </p>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded-l"
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-12 text-center border-t border-b border-gray-300 py-1"
                            />
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded-r"
                                disabled={quantity >= product.stock}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    )}

                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors w-full mt-3">
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product images gallery */}
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
                {product.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-lg transition-transform transform hover:scale-105 ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'}`}
                        onClick={() => setSelectedImage(image)}
                    />
                ))}
            </div>

            {/* Specifications Section */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold">Specifications:</h3>
                <ul className="list-disc list-inside mt-2">
                    {product.specifications && product.specifications.map((spec, index) => (
                        <li key={index} className="text-gray-700">
                            <strong>{spec.key}: </strong>{spec.value}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold">Customer Reviews:</h3>
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                        <div key={index} className="border-t pt-3 mt-3">
                            <p className="font-semibold">{review.name} <span className="text-yellow-500">({review.rating}★)</span></p>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 mt-2">No reviews yet. Be the first to leave a review!</p>
                )}
            </div>
        </div>
    );
};

export default ProductsDetail;
