import React from 'react';
import { Link } from 'react-router-dom';

export const productData = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 59.99,
        description: "High-quality wireless headphones with noise-cancellation.",
        images: [
            "https://www.shopz.com.bd/wp-content/uploads/2023/11/Beats-Studio-Pro-Wireless-Headphones.jpg",
            "https://www.ultrapickleball.com/cdn/shop/products/31DxlSmArPL.jpg?v=1575933711",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9_gLSGi-IHrZ6GAbdPt9SGT0_AWCLZXWJvkiwtYm0wwfLFT9lyeJRdjcgweTg6SPeRsw&usqp=CAU"
        ],
        category: "Electronics",
        stock: 12,
        specifications: [
            { key: "Battery Life", value: "20 hours" },
            { key: "Bluetooth", value: "5.0" },
            { key: "Weight", value: "250g" }
        ],
        reviews: [
            { name: "John Doe", rating: 5, comment: "Fantastic sound quality and very comfortable." },
            { name: "Jane Smith", rating: 4, comment: "Great headphones, but battery life could be better." }
        ]
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        description: "Latest model with a powerful processor and a stunning display.",
        images: [
            "https://www.cnet.com/a/img/resize/690ad0a97cf8fc98f3cf851e7b149d2ffc5b171e/hub/2023/05/04/31dfdcf2-1ac3-4320-b40c-4c356300f06e/google-pixel-7a-phone-14.jpg?auto=webp&height=500",
            "https://media.kasperskydaily.com/wp-content/uploads/sites/37/2023/06/14135820/how-to-lock-your-android-smartphone-feature.jpg",
            "https://www.dataselect.com/wp-content/uploads/2023/08/Smartphone-Specifications-Explained-4.webp"
        ],
        category: "Electronics",
        stock: 5,
        specifications: [
            { key: "Processor", value: "Octa-core 2.8 GHz" },
            { key: "RAM", value: "8GB" },
            { key: "Battery", value: "4000mAh" }
        ],
        reviews: [
            { name: "Alice Johnson", rating: 5, comment: "Amazing performance, worth every penny!" },
            { name: "Bob Lee", rating: 4, comment: "Good phone, but the camera could be better." }
        ]
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 49.99,
        description: "Automatic coffee maker with multiple brewing options.",
        images: [
            "https://via.placeholder.com/150"
        ],
        category: "Appliances",
        stock: 7,
        specifications: [
            { key: "Capacity", value: "12 cups" },
            { key: "Power", value: "1000W" },
            { key: "Brew Settings", value: "Espresso, Cappuccino, Regular" }
        ],
        reviews: [
            { name: "Emily Clark", rating: 5, comment: "Makes great coffee and is very easy to use." },
            { name: "Tom Hardy", rating: 4, comment: "Solid coffee maker, but it’s a bit noisy." }
        ]
    },
    {
        id: 5,
        name: "Gaming Mouse",
        price: 29.99,
        description: "Ergonomic gaming mouse with customizable RGB lighting.",
        images: [
            "https://via.placeholder.com/150"
        ],
        category: "Electronics",
        stock: 25,
        specifications: [
            { key: "DPI", value: "16000" },
            { key: "Weight", value: "85g" },
            { key: "RGB Lighting", value: "Customizable" }
        ],
        reviews: [
            { name: "David Miller", rating: 5, comment: "Perfect for gaming with fast response times." },
            { name: "Sarah Connor", rating: 4, comment: "Good mouse but could use more weight." }
        ]
    }
];

const Products = () => {
    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-5">Products List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productData.map((product) => (
                    <div key={product.id} className="border p-4 rounded shadow-lg">
                        <Link to={`/products/${product.id}`}>
                            <img
                                src={product.images[0]}  // Display the first image
                                alt={product.name}
                                className="w-full h-40 object-cover mb-3 rounded"
                            />
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <p className="text-gray-700">{product.description}</p>
                            <p className="font-semibold">Category: {product.category}</p>
                            <p className="font-bold text-lg">Price: ${product.price.toFixed(2)}</p>
                            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                            </p>

                      

                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-3">
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
