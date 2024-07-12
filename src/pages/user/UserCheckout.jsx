import { useState, useEffect, useContext } from 'react';
import { getCouponByCode, calculateDiscount } from '../../utils/couponUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTrash,
  faTimes,
  faCalendar,
  faShoppingCart,
  faCreditCard,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { format, addDays } from 'date-fns';
import UserContext from '../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import axiosUser from '../../utils/axiosUser';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { cartLengthAtom } from '../../atoms/cartAtom';
import { fetchCart } from '../../utils/cartUtils';

function UserCheckout() {
  const [, setCartLength] = useAtom(cartLengthAtom);
  const { user } = useContext(UserContext);
  const [trip, setTrip] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoyager, setCurrentVoyager] = useState('');
  const [voyagers, setVoyagers] = useState({
    1: { firstName: user?.firstname, lastName: user?.lastname },
  });
  const [departureDate, setDepartureDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register: registerPromo,
    handleSubmit: handleSubmitPromo,
    formState: { errors: promoErrors },
  } = useForm();

  const [notification, setNotification] = useState({
    type: null,
    message: '',
  });

  useEffect(() => {
    setIsLogin(user !== null);
  }, [user]);

  useEffect(() => {
    const fetchTrip = async () => {
      setIsLoading(true);
      try {
        const response = await axiosUser.get(`/trips/${id}`);
        setTrip(response.data.trip);
        setTotalAmount(response.data.trip.price);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();

    setDepartureDate(addDays(new Date(), 1));
  }, [id]);

  useEffect(() => {
    if (trip) {
      setTotalAmount(trip.price * Object.keys(voyagers).length);
    }
  }, [trip, voyagers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!trip) {
    navigate('/error');
    return null;
  }

  const openModal = (voyager) => {
    setCurrentVoyager(voyager);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (
      voyagers[currentVoyager]?.firstName === '' &&
      voyagers[currentVoyager]?.lastName === ''
    ) {
      setVoyagers((prev) => {
        const newVoyagers = { ...prev };
        delete newVoyagers[currentVoyager];
        return newVoyagers;
      });
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVoyagers((prev) => ({
      ...prev,
      [currentVoyager]: {
        ...prev[currentVoyager],
        [name]: value,
      },
    }));
  };

  const saveVoyagerInfo = () => {
    if (
      voyagers[currentVoyager]?.firstName &&
      voyagers[currentVoyager]?.lastName
    ) {
      closeModal();
    } else {
      alert('Please fill in both first name and last name');
    }
  };

  const deleteVoyager = () => {
    setVoyagers((prev) => {
      const newVoyagers = { ...prev };
      delete newVoyagers[currentVoyager];

      const reorderedVoyagers = {};
      Object.values(newVoyagers).forEach((voyager, index) => {
        reorderedVoyagers[index + 1] = voyager;
      });

      return reorderedVoyagers;
    });
    closeModal();
  };

  const addNewVoyager = () => {
    const newVoyagerNumber = Object.keys(voyagers).length + 1;
    setVoyagers((prev) => ({
      ...prev,
      [newVoyagerNumber]: { firstName: '', lastName: '' },
    }));
    setCurrentVoyager(newVoyagerNumber.toString());
    setIsModalOpen(true);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate >= new Date()) {
      setDepartureDate(selectedDate);
    }
  };

  const addToCart = async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    const cartItem = {
      trip_id: id,
      departure_date: departureDate,
      travelers: Object.values(voyagers),
    };

    try {
      const response = await axiosUser.post('/cart', cartItem);
      const { cartLength } = await fetchCart();
      setCartLength(cartLength);
      setNotification({
        type: 'success',
        message: 'Trip successfully added to cart',
      });
      setTimeout(() => {
        setNotification({ type: null, message: '' }); // Clear notification after timeout
      }, 3000); // 3 seconds
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({ type: 'error', message: 'Error adding trip to cart' });
      setTimeout(() => {
        setNotification({ type: null, message: '' }); // Clear notification after timeout
      }, 3000); // 3 seconds
    }
  };

  const handleApplyPromo = async () => {
    try {
      const couponData = await getCouponByCode(promoCode);

      if (trip.price < couponData.coupon.minimumPurchaseAmount) {
        setNotification({
          type: 'error',
          message: 'Minimum purchase amount not reached',
        });
        return;
      }

      const calculatedDiscount = calculateDiscount(
        trip.price,
        couponData.coupon.type,
        couponData.coupon.discount
      );

      setDiscount(calculatedDiscount);
      setNotification({
        type: 'success',
        message: 'Promo code applied successfully!',
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Invalid promo code' });
      console.error(error);
    }
  };

  const handlePayment = async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    const userId = localStorage.getItem('userId');

    const bookingRequest = {
      user_id: userId,
      booked_trips: [
        {
          trip_id: trip._id,
          travelers: Object.values(voyagers).map((traveler) => ({
            firstName: traveler.firstName,
            lastName: traveler.lastName,
          })),
        },
      ],
      coupon: promoCode
        ? {
            code: promoCode,
            type: 'discount',
            discount: discount,
          }
        : null,
    };

    console.log('Booking Request:', bookingRequest);

    setNotification({ type: 'success', message: 'Payment successful!' }); // Assuming payment is successful
    setTimeout(() => {
      setNotification({ type: null, message: '' }); // Clear notification after timeout
    }, 3000); // 3 seconds
  };
  return (
    <div className="min-h-screen bg-[url('/bg-desktop.webp')] py-8 px-4 md:py-16 md:px-48">
      <section className="bg-white rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold pt-8 pb-10 text-indigo-700">
            Booking Details
          </h1>
        </div>
        <div className="md:flex md:pb-6">
          <div className="hidden md:block px-16 md:w-1/2 border-r border-gray-200">
            <img
              src={trip.images[0]}
              alt="Okinawa Aquarium"
              className="rounded-3xl shadow-lg transform hover:scale-105 transition duration-300"
            />
            <p className="text-lg font-normal py-4 text-gray-700">
              {trip.description}
            </p>
            <div className="rounded-3xl shadow-lg px-8 py-6 mb-6 ">
              <h2 className="text-2xl font-extrabold py-4 text-indigo-800">
                {trip.name}
              </h2>
              <div className="mb-4 relative">
                <label
                  htmlFor="departure-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Departure Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="departure-date"
                    name="departure-date"
                    value={format(departureDate, 'yyyy-MM-dd')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                  />
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md">
                <div className="flex-col flex items-center">
                  <p className="font-extrabold text-xl text-indigo-700">
                    {trip.destination_from}
                  </p>
                  <p className="font-bold bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 mt-2">
                    {format(departureDate, 'EEE d MMM')}
                  </p>
                </div>
                <div className="flex-col flex items-center">
                  <img
                    src="/planeBlue.svg"
                    alt="Plane icon"
                    className="w-10 h-10"
                  />
                  <p className="font-semibold text-red-500 mt-2">
                    ({trip.duration_days} days {trip.duration_days - 1} nights)
                  </p>
                </div>
                <div className="flex-col flex items-center">
                  <p className="font-extrabold text-xl text-indigo-700">
                    {trip.destination_to}
                  </p>
                  <p className="font-bold bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 mt-2">
                    {format(
                      addDays(departureDate, trip.duration_days - 1),
                      'EEE d MMM'
                    )}
                  </p>
                </div>
              </div>

              <button className="flex mt-2 text-lg text-indigo-600 items-center hover:underline">
                <span>Policy | Things to know before traveling</span>
                <span className="text-2xl ml-2">&#8227;</span>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 md:px-10">
            <div className="rounded-3xl shadow-lg px-8 py-6 mb-6 bg-white">
              <h2 className="text-2xl font-extrabold py-4 text-indigo-800">
                Voyagers
              </h2>
              {Object.keys(voyagers).length === 0 ? (
                <p className="text-gray-500 italic">No voyagers yet</p>
              ) : (
                Object.entries(voyagers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-200 py-3"
                  >
                    <p className="text-lg">
                      Voyager {key}: {value.firstName} {value.lastName}
                    </p>
                    <button
                      onClick={() => openModal(key)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <img src="/pencil.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
              <button
                className="btn btn-outline text-blue-500 w-full mt-4 hover:bg-indigo-500 hover:text-white transition duration-300"
                onClick={addNewVoyager}
              >
                + Add Voyager
              </button>
            </div>
            <div className="bg-white shadow-xl p-6 md:w-full card rounded-2xl  my-4 h-fit">
              <form onSubmit={handleSubmitPromo(handleApplyPromo)}>
                <h3 className="text-lg font-semibold mb-2">Promotions</h3>
                <div className="mb-4">
                  <label
                    htmlFor="promo-code"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Enter Promo Code
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      id="promo-code"
                      value={promoCode}
                      placeholder="promo code"
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow  focus:outline-none focus:ring focus:ring-blue-500 rounded-l border border-gray-300 py-2 px-4"
                    />
                    <button
                      onClick={handleApplyPromo}
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                    >
                      Apply
                    </button>
                  </div>
                  {promoErrors.promoCode && (
                    <span className="text-red-500">
                      Please enter a promo code
                    </span>
                  )}
                </div>

                <div className="rounded-3xl shadow-lg px-8 py-6 mb-6 bg-white">
                  <h2 className="text-2xl font-extrabold py-4 text-indigo-800">
                    Payment Information
                  </h2>
                  <div className="flex justify-between items-center font-semibold text-gray-700">
                    <p className="text-lg py-2">
                      Package {trip.name} x {Object.keys(voyagers).length}
                    </p>
                    <p>
                      $
                      {(
                        trip.price * Object.keys(voyagers).length
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-gray-700">
                    <p className="text-lg py-2">Discount</p>
                    <p>${discount}</p>
                  </div>
                </div>
                <p className="text-red-500 text-sm">
                  To prevent duplicate use, the discount code will be removed
                  once you add a trip to your cart. Please re-enter the code at
                  checkout to apply the discount to your purchase.
                </p>
              </form>
              <div className="flex justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl mt-4 text-white">
                <div className="flex flex-col">
                  <p className="text-sm font-bold">Total Payment</p>
                  <p className="text-3xl font-bold">
                    $ {totalAmount - discount}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="btn bg-white text-indigo-700 hover:bg-indigo-100 rounded-full px-4 transition duration-300 flex items-center"
                    onClick={addToCart}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handlePayment}
                    className="btn bg-white text-indigo-700 hover:bg-indigo-100 rounded-full px-4 transition duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      {notification.type && (
        <div
          className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl
      bg-gradient-to-r from-${
        notification.type === 'success' ? 'blue-400' : 'red-400'
      } to-${
            notification.type === 'success' ? 'blue-600' : 'red-600'
          } text-white font-semibold transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={
                notification.type === 'success'
                  ? faCheckCircle
                  : faExclamationCircle
              }
              className="h-6 w-6"
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Passenger Modal */}
      <dialog
        id="passenger_modal"
        className={`modal ${isModalOpen ? 'modal-open' : ''}`}
      >
        <form method="dialog" className="modal-box bg-white rounded-2xl">
          <h3 className="font-bold text-2xl mb-4 text-indigo-800">
            Enter Voyager {currentVoyager} Information
          </h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={voyagers[currentVoyager]?.firstName || ''}
              onChange={handleInputChange}
              className="input input-bordered focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text text-gray-700">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={voyagers[currentVoyager]?.lastName || ''}
              onChange={handleInputChange}
              className="input input-bordered focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="modal-action flex justify-end space-x-2 mt-6">
            <button
              className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
              onClick={saveVoyagerInfo}
              title="Save"
            >
              <FontAwesomeIcon
                icon={faSave}
                className="text-indigo-500 text-xl"
              />
            </button>
            <button
              className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
              onClick={deleteVoyager}
              title="Delete"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-400 text-xl"
              />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={closeModal}
              title="Cancel"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-400 text-xl"
              />
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
export default UserCheckout;
