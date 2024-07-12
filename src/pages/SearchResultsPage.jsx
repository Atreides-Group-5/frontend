import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import DestinationCard from '../components/DestinationCard';
import axiosVisitor from '../utils/axiosVisitor';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('name') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSearchResults(initialSearchTerm);
  }, [initialSearchTerm]);

  const fetchSearchResults = async (name) => {
    setIsLoading(true);
    try {
      const response = await axiosVisitor.get(
        `/trips/search`,
        {
          params: { name },
        }
      );
      setSearchResults(response.data.trips || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    fetchSearchResults(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destinations or activities..."
              className="flex-grow py-2 px-4 rounded-l-full border-2 border-r-0 border-blue-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-r-full hover:bg-blue-600 transition duration-300"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for "{initialSearchTerm}"
          </h1>
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
          </button> */}
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            {/* Add your filter options here */}
            <h2 className="text-lg font-semibold mb-2">Filters</h2>
            {/* Example filter options */}
            <div className="flex flex-wrap gap-4">
              <select className="border rounded px-2 py-1">
                <option>Price Range</option>
                {/* Add price range options */}
              </select>
              <select className="border rounded px-2 py-1">
                <option>Duration</option>
                {/* Add duration options */}
              </select>
              <select className="border rounded px-2 py-1">
                <option>Rating</option>
                {/* Add rating options */}
              </select>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DestinationCard {...result} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl">
            No results found for "{searchTerm}". Try a different search term or
            browse our popular destinations.
          </p>
        )}

        {/* {!isLoading && searchResults.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/explore"
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Explore More Destinations
            </Link>
          </div>
        )} */}
      </main>
    </div>
  );
};

export default SearchResultsPage;
