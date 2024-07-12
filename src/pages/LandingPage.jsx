import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTicket } from '@fortawesome/free-solid-svg-icons';
import { fetchCoupons } from '../utils/couponUtils';
import DestinationCard from '../components/DestinationCard';

import axiosVisitor from '../utils/axiosVisitor';

const recommended = [
  {
    id: 1,
    imageSrc: '/destination/discount.jpg',
    title: 'Special Discounts',
    type: 'code',
  },
  {
    id: 2,
    imageSrc: '/destination/fuji.jpg',
    title: 'Japan',
    type: 'search',
  },
  {
    id: 3,
    imageSrc: '/destination/thai.jpg',
    title: 'Thailand',
    type: 'search',
  },
  {
    id: 4,
    imageSrc: '/destination/europe.jpg',
    title: 'European Adventure',
    type: 'search',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleOfferClick = (offer) => {
    if (offer.type === 'search') {
      navigate(`/search-results?name=${encodeURIComponent(offer.title)}`);
    } else if (offer.type === 'code') {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const Offer = ({ imageSrc, altText, title, type }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={() => handleOfferClick({ type, title })}
        className="cursor-pointer"
      >
        <div className="block relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-48 object-cover"
          />
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    setImageLoaded(true);
  }, []);
  useEffect(() => {
    const fetchRecommendedItems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosVisitor.get('/trips');
        const allTrips = response.data.trips || [];
        const shuffledTrips = allTrips.sort(() => 0.5 - Math.random());
        const selectedTrips = shuffledTrips.slice(0, 8);
        setRecommendedItems(selectedTrips);
      } catch (error) {
        console.error('Error fetching recommended items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCouponsData = async () => {
      setIsLoadingCoupons(true);
      try {
        const response = await fetchCoupons();
        setCoupons(response.coupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setIsLoadingCoupons(false);
      }
    };

    fetchRecommendedItems();
    fetchCouponsData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header
        className={`bg-cover bg-center text-white py-12 relative z-10 ${
          imageLoaded ? '' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfti5yyyn/image/upload/v1720750124/santorini_nnqkww.webp')`,
        }}
      >
        {' '}
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Your World of Adventures Awaits
          </h1>
          <p className="text-xl mb-8">Discover • Book • Voyage</p>
          <form className="relative max-w-2xl mx-auto" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search destinations or activities..."
              className="w-full py-3 px-4 pr-12 rounded-full text-gray-800 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">
            Latest Travel Promotions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommended.map((offer) => (
              <Offer key={offer.id} {...offer} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Recommended for You</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : recommendedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedItems.map((item) => (
                <DestinationCard
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  destination_from={item.destination_from}
                  destination_to={item.destination_to}
                  rating={item.rating}
                  price={item.price}
                  images={item.images}
                />
              ))}
            </div>
          ) : (
            <p>No recommended items available.</p>
          )}
          <dialog id="my_modal_1" className="modal" open={isModalOpen}>
            <div className="modal-box bg-white rounded-3xl shadow-2xl overflow-hidden w-full ">
              <div className="text-center p-8 md:p-12">
                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold">
                    <FontAwesomeIcon icon={faTicket} />
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-4">
                  Available Coupons
                </h3>

                {isLoadingCoupons ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : coupons.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon._id}
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl"
                      >
                        <h4 className="font-semibold text-xl text-indigo-700">
                          {coupon.name}
                        </h4>
                        <p className="text-gray-700 mt-2">
                          Code:{' '}
                          <span className="font-mono bg-white px-2 py-1 rounded-full text-indigo-600">
                            {coupon.code}
                          </span>
                        </p>
                        <p className="text-indigo-600 font-semibold mt-1">
                          {coupon.type === 'percent'
                            ? `${coupon.discount}% off`
                            : `$${coupon.discount} off`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum purchase: ${coupon.minimumPurchaseAmount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-lg">
                    No coupons available at the moment.
                  </p>
                )}

                <div className="mt-8">
                  <button
                    onClick={closeModal}
                    className="btn bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 rounded-full px-6 py-3 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 md:p-8">
                <p className="text-center text-indigo-800 font-semibold">
                  Have questions about our coupons? Contact us at{' '}
                  <a
                    href="mailto:support@voyage.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@voyage.com
                  </a>
                </p>
              </div>
            </div>
          </dialog>
        </section>

        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-wide rounded-full bg-blue-500 text-white font-bold text-xl px-8 shadow-lg"
          >
            Explore More
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
