import React from 'react';

// Fake cart data
const cartData = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 59.99,
        quantity: 2,
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        quantity: 1,
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        quantity: 3,
        image: "https://via.placeholder.com/150"
    }
];

const CartList = () => {
    const calculateTotalPrice = (price, quantity) => (price * quantity).toFixed(2);

    const calculateCartTotal = () => cartData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center">Your Cart</h1>
            <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
                {cartData.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center p-2"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 ml-2">
                            <h2 className="text-sm font-semibold mb-1">{item.name}</h2>
                            <p className="text-gray-600 text-sm mb-1">Price: ${item.price.toFixed(2)}</p>
                            <p className="text-gray-600 text-sm mb-1">Quantity: {item.quantity}</p>
                            <p className="font-semibold text-sm">Total: ${calculateTotalPrice(item.price, item.quantity)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white border-t border-gray-300 pt-2">
                <h3 className="text-xl font-bold mb-2 text-center">Cart Total: ${calculateCartTotal()}</h3>
                <div className="flex justify-center">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-lg shadow-sm transition duration-150 transform hover:scale-105">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartList;
