import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faStar,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axiosVisitor from '../../utils/axiosVisitor';

const ContentHead = ({ trip }) => {
  return (
    <div className="rounded-3xl shadow-lg px-6 py-6 mb-6 bg-gradient-to-r from-indigo-50 to-blue-50">
      <h2 className="text-xl md:text-2xl font-extrabold py-4 text-indigo-800">
        {trip.name}
      </h2>
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md">
        <div className="flex-col flex items-center">
          <p className="font-extrabold text-lg md:text-xl text-indigo-700">
            {trip.destination_from}
          </p>
        </div>
        <div className="flex-col flex items-center">
          <img
            src="/planeBlue.svg"
            alt="Plane icon"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <p className="font-semibold text-sm md:text-base text-red-500 mt-2">
            ({trip.duration_days} Days)
          </p>
        </div>
        <div className="flex-col flex items-center">
          <p className="font-extrabold text-lg md:text-xl text-indigo-700">
            {trip.destination_to}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-2" />
          <p className="text-sm md:text-base">{trip.destination_to}</p>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-2" />
          <p className="text-sm md:text-base">{trip.rating}</p>
        </div>
      </div>
      <button className="flex mt-4 text-base md:text-lg text-indigo-600 items-center hover:underline">
        <span>Read full program details</span>
        <span className="text-xl md:text-2xl ml-2">&#8227;</span>
      </button>
      <button className="flex mt-2 text-base md:text-lg text-indigo-600 items-center hover:underline">
        <span>Policy | Things to know before traveling</span>
        <span className="text-xl md:text-2xl ml-2">&#8227;</span>
      </button>
    </div>
  );
};

const ProductDetails = ({ trip }) => {
  return (
    <div className="rounded-3xl shadow-lg px-6 py-6 mb-6 bg-white">
      <h2 className="text-xl md:text-2xl font-extrabold py-4 text-indigo-800">
        Package Details
      </h2>
      <p className="text-base md:text-lg font-normal py-4 text-gray-700">
        {trip.description}
      </p>
      <ul>
        {trip.sub_expenses.map((expense, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b border-gray-200"
          >
            <p className="text-base md:text-lg font-normal">
              {expense.expense_name}
            </p>
            <p className="text-base md:text-lg font-normal">
              ${expense.expense_amount.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserProductPage = () => {
  const [showMedal, setShowMedal] = useState(false);
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUserData } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      setIsLoading(true);
      try {
          const response = await axiosVisitor.get(`/trips/${id}`);
          // Axios automatically throws an error for non-2xx responses
          const data = response.data;
          setTrip(data.trip);
      } catch (error) {
          console.error('Error fetching trip details:', error);
          // Handle error or throw it further if needed
      } finally {
          setIsLoading(false);
      }
  };

    fetchTrip();
  }, [id]);

  const handleBooking = () => {
    setShowMedal(true);
    setTimeout(() => {
      setShowMedal(false);
      navigate('/checkout/' + id);
    }, 1500);
    // console.log(id);
    return;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!trip) {
    navigate('/error');
    return;
  }

  return (
    <div className="min-h-screen bg-[url('/bg-desktop.webp')] py-8 px-4 md:py-16 md:px-8 lg:px-16">
      <section className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold pt-8 pb-6 md:pb-10 text-indigo-700">
            Package Details
          </h1>
        </div>
        <div className="md:flex">
          {/* Full-screen image for mobile */}
          <div className="md:hidden">
            <img
              src={trip.images[0]}
              alt={trip.name}
              className="w-full h-[50vh] object-cover rounded-b-3xl"
            />
          </div>

          {/* Desktop layout */}
          <div className="hidden md:block md:w-1/2 px-6 lg:px-8 xl:px-16 border-r border-gray-200">
            <div className="relative pb-[56.25%] mb-4">
              <img
                src={trip.images[0]}
                alt={trip.name}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-lg transform hover:scale-105 transition duration-300"
              />
            </div>
            <p className="text-base lg:text-lg font-normal py-4 text-gray-700">
              {trip.description}
            </p>
          </div>
          <div className="md:w-1/2 px-6 lg:px-8 xl:px-10">
            <ContentHead trip={trip} />
            <ProductDetails trip={trip} />
            <div className="flex justify-between px-4 py-4 mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl mt-4 text-white">
              <div className="flex flex-col">
                <p className="text-sm font-bold">Total Payment</p>
                <p className="text-2xl md:text-3xl font-bold">
                  ${trip.price.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="btn bg-white text-indigo-700 hover:bg-indigo-100 rounded-full px-4 py-2 transition duration-300 flex items-center text-sm md:text-base"
                  onClick={handleBooking}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showMedal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProductPage;
