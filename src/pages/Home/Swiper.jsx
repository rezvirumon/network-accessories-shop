import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal'; // Import the Fade animation
import './Swiper.css'; // Import the CSS file for additional styling

const Swiper = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
            } catch (error) {
                const errorMessage = error.response
                    ? error.response.data.message
                    : 'Error fetching products. Please try again later.';
                console.error('Error fetching products:', errorMessage, error);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                if (products[currentIndex]?.images.length) {
                    return (prevIndex + 1) % products[currentIndex].images.length;
                }
                return 0;
            });
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(imageInterval); // Cleanup interval on component unmount
    }, [currentIndex, products]);

    useEffect(() => {
        const productInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (products.length) {
                    return (prevIndex + 1) % products.length;
                }
                return 0;
            });
            setCurrentImageIndex(0); // Reset image index when changing product
        }, 10000); // Change product every 10 seconds

        return () => clearInterval(productInterval); // Cleanup interval on component unmount
    }, [products.length]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === 0) {
                const prevProductIndex = (currentIndex === 0 ? products.length - 1 : currentIndex - 1);
                setCurrentIndex(prevProductIndex);
                return products[prevProductIndex]?.images.length - 1 ?? 0;
            }
            return prevIndex - 1;
        });
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === (products[currentIndex]?.images.length ?? 0) - 1) {
                const nextProductIndex = (currentIndex === products.length - 1 ? 0 : currentIndex + 1);
                setCurrentIndex(nextProductIndex);
                return 0;
            }
            return prevIndex + 1;
        });
    };

    return (
        <div className="relative w-full overflow-hidden bg-white rounded-lg">
            <div className="flex items-center w-full h-[50vh] overflow-hidden">
                {products.length > 0 && (
                    <div className="w-full lg:w-[60vw] mx-auto">
                        <Fade
                            key={currentIndex}
                            duration={500} // Duration of the fade effect
                            triggerOnce={true} // Trigger animation only once
                        >
                            <div className="transition-transform duration-500 ease-in-out">
                                <div className='flex justify-around items-center p-6'>
                                    <div className="flex flex-col">
                                        <h3 className="text-5xl text-yellow-500 font-bold mb-5">{products[currentIndex].name}</h3>
                                        <p className='text-xl font-semibold'>{products[currentIndex].description}</p>
                                    </div>
                                    <img
                                        src={products[currentIndex].images[currentImageIndex]} // Display the current image for the current product
                                        alt={products[currentIndex].name}
                                        className="w-64"
                                    />
                                </div>
                            </div>
                        </Fade>
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <button onClick={handlePrev} className="btn btn-circle">❮</button>
                            <button onClick={handleNext} className="btn btn-circle">❯</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Swiper;
