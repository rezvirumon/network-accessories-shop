import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios'; // Ensure axios is installed
import { debounce } from 'lodash'; // Install lodash for debounce

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    const fetchSuggestions = debounce(async (query) => {
        if (!query) {
            setSuggestions([]);
            setError(null);
            return;
        }
        try {
            const response = await axios.get('http://localhost:3001/api/products/search', { params: { q: query } });
            if (response.status === 200) {
                const data = response.data;
                if (Array.isArray(data) && data.length > 0) {
                    setSuggestions(data);
                    setError(null);
                } else {
                    setSuggestions([]);
                    setError('No products found');
                }
            } else {
                setError('Failed to fetch suggestions. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('Failed to fetch suggestions. Please try again later.');
        }
    }, 300);

    useEffect(() => {
        let isMounted = true;

        if (searchInput) {
            fetchSuggestions(searchInput);
        } else {
            setSuggestions([]);
            setError(null);
        }

        return () => {
            isMounted = false;
            fetchSuggestions.cancel();
        };
    }, [searchInput]);

    return (
        <div className="relative hidden md:block">
            <input
                type="text"
                placeholder="name or category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="px-4 py-2 w-64 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                aria-label="Search"
            />
            <FaSearch className="absolute top-3 right-4 text-gray-400" />
            {searchInput && (
                <div className="absolute left-0 mt-2 w-full bg-white text-gray-700 rounded-lg shadow-lg z-50">
                    <ul>
                        {error && <li className="px-4 py-2 text-red-500">{error}</li>}
                        {suggestions.length > 0 ? (
                            suggestions.map((item) => (
                                <li key={item._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                    <img
                                        src={(item.images && item.images[0]) || 'https://via.placeholder.com/50'}
                                        alt={item.name || 'Product Image'}
                                        className="w-12 h-12 object-cover rounded mr-2"
                                    />
                                    <a href={`/products/${item._id}`} onClick={() => setSearchInput('')}>
                                        {item.name || 'Product Name'}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No suggestions</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
