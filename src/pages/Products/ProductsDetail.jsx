import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ProductsDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${id}`);
                if (response.data) {
                    setProduct(response.data);
                    setSelectedImage(response.data.images[0]);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cartItems.findIndex(item => item.id === id);

        if (productIndex > -1) {
            cartItems[productIndex].quantity += quantity;
        } else {
            cartItems.push({ ...product, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        toast.success('Product added to cart!', {
            position: 'bottom-center',
            duration: 3000
        });
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <Toaster />
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 flex justify-center">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full lg:h-[500px] rounded-lg object-cover bg-white"
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
                    <p className="text-lg mb-4">{product.description}</p>
                    <p className="text-2xl font-bold mb-4">Price: TK/{product.price.toFixed(2)}</p>
                    <p className="text-md font-semibold mb-4">
                        Category: <span className="">{product.category}</span>
                    </p>
                    <p className={`font-semibold mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </p>

                    {product.stock > 0 && (
                        <div className="flex items-center mb-6 text-xl">
                            <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
                                -
                            </button>
                            <span className="mx-2">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock}>
                                +
                            </button>
                        </div>
                    )}
                    <button
                        className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                {product.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-24 bg-white h-24 object-cover cursor-pointer ${selectedImage === image ? 'border-2 border-blue-500' : 'border'}`}
                        onClick={() => setSelectedImage(image)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductsDetail;
