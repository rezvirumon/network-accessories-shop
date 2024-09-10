import React from 'react';

// Mock Account Data in JSON Format
const accountData = [
    {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        balance: 150.75,
        role: "Admin",
        status: "Active"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "janesmith@example.com",
        balance: 89.99,
        role: "User",
        status: "Active"
    },
    {
        id: 3,
        name: "Michael Johnson",
        email: "michaelj@example.com",
        balance: 250.00,
        role: "Moderator",
        status: "Inactive"
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emilyd@example.com",
        balance: 12.49,
        role: "User",
        status: "Active"
    },
    {
        id: 5,
        name: "David Brown",
        email: "davidb@example.com",
        balance: 45.30,
        role: "Admin",
        status: "Active"
    }
];

const Accounts = () => {
    const handleViewProfile = (account) => {
        console.log(`Viewing profile of ${account.name}`);
        // Logic to navigate to the user's profile or fetch more details
    };

    const handleManageAccount = (id) => {
        console.log(`Managing account for user ID: ${id}`);
        // Logic for managing the account (e.g., editing, deactivating)
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-5">Accounts List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accountData.map((account) => (
                    <div key={account.id} className="border p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-2">{account.name}</h2>
                        <p className="text-gray-600 mb-2">{account.email}</p>
                        <p className="text-lg font-bold mb-2">Balance: ${account.balance.toFixed(2)}</p>
                        <p className="font-semibold mb-2">
                            Role: <span className={account.role === 'Admin' ? 'text-blue-600' : 'text-gray-700'}>{account.role}</span>
                        </p>
                        <p className={`font-semibold ${account.status === 'Active' ? 'text-green-600' : 'text-red-600'} mb-4`}>
                            {account.status}
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleViewProfile(account)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                            >
                                View Profile
                            </button>
                            <button
                                onClick={() => handleManageAccount(account.id)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Manage Account
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
