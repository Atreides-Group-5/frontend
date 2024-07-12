import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTrash,
  faTimes,
  faCalendar,
  faShoppingCart,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { format, addDays } from 'date-fns';
import UserContext from '../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UserCartEditPage() {
  const { user } = useContext(UserContext);
  const [trip, setTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoyager, setCurrentVoyager] = useState('');
  const [voyagers, setVoyagers] = useState({
    1: { firstName: user.firstname, lastName: user.lastname },
  });
  const [departureDate, setDepartureDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showMedal, setShowMedal] = useState(false);
  const navigate = useNavigate();
  const { cartItemId } = useParams();
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const fetchCartItem = async () => {
      setIsLoading(true); // แสดง loading ในระหว่างรอข้อมูล
      try {
        // 1. Fetch cart item จาก backend
        const cartResponse = await axios.get(
          `http://localhost:3000/api/cart/${cartItemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );

        // 2. ตรวจสอบ response
        if (cartResponse.status !== 200) {
          throw new Error('Failed to fetch cart item');
        }

        const cartItemData = cartResponse.data.cartItem;

        // 3. อัพเดต state ด้วยข้อมูล cart item
        setCartItem(cartItemData);
        setVoyagers(
          cartItemData.travelers.reduce((acc, traveler, index) => {
            acc[index + 1] = {
              firstName: traveler.firstName,
              lastName: traveler.lastName,
            };
            return acc;
          }, {})
        );
        setDepartureDate(new Date(cartItemData.departure_date));

        // 4. Fetch ข้อมูล trip ที่เกี่ยวข้อง
        const tripResponse = await axios.get(
          `http://localhost:3000/api/trips/${cartItemData.trip_id}`
        );
        if (tripResponse.status !== 200) {
          throw new Error('Failed to fetch trip details');
        }
        setTrip(tripResponse.data.trip);
      } catch (error) {
        console.error(error);
        // 5. Error handling (เช่น แสดง alert หรือ redirect)
        if (error.response && error.response.status === 404) {
          navigate('/cart'); // ถ้าไม่พบ cart item ให้กลับไปหน้า cart
        } else {
          // กรณี error อื่น ๆ
          setPromoAlertMessage(
            'An error occurred while fetching cart details.'
          );
          setShowPromoAlert(true);
          setTimeout(() => setShowPromoAlert(false), 3000);
        }
      } finally {
        setIsLoading(false); // ปิด loading
      }
    };

    if (cartItemId) {
      fetchCartItem();
    }
  }, [cartItemId, navigate]); //

  // useEffect(() => {
  //   const fetchTrip = async () => {
  //     console.log("CARTITEM", cartItem);
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`http://localhost:3000/api/trips/${cartItem.trip_id}`);
  //       console.log(response.data.trip);
  //       setTrip(response.data.trip);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     setIsLoading(false);
  //   };
  //   fetchTrip();

  //   // Set initial departure date to tomorrow
  //   setDepartureDate(addDays(new Date(), 1));
  // }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!trip) {
    console.log('ERROR 1');
    navigate('/cart');
    return;
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
      console.log(voyagers);
    } else {
      alert('Please fill in both first name and last name');
    }
  };

  const deleteVoyager = () => {
    if (Object.keys(voyagers).length === 1) {
      alert('At least one voyager must be specified');
      return;
    }
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

  const updateCart = async () => {
    const cartItem = {
      departure_date: departureDate,
      travelers: [],
    };
    for (let voyager in voyagers) {
      cartItem.travelers.push(voyagers[voyager]);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/cart/${cartItemId}`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setShowMedal('green');
      setTimeout(() => {
        setShowMedal(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setShowMedal('red');
      setTimeout(() => {
        setShowMedal(false);
      }, 1000);
    }
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
          </div>
          <div className="md:w-1/2 md:px-10">
            <div className="rounded-3xl shadow-lg px-8 py-6 mb-6 bg-gradient-to-r from-indigo-50 to-blue-50">
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
              <button className="flex mt-4 text-lg text-indigo-600 items-center hover:underline">
                <span>Read full program details</span>
                <span className="text-2xl ml-2">&#8227;</span>
              </button>
              <button className="flex mt-2 text-lg text-indigo-600 items-center hover:underline">
                <span>Policy | Things to know before traveling</span>
                <span className="text-2xl ml-2">&#8227;</span>
              </button>
            </div>
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
                className="btn btn-outline btn-info w-full mt-4 hover:bg-indigo-500 hover:text-white transition duration-300"
                onClick={addNewVoyager}
              >
                + Add Voyager
              </button>
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
                  {(trip.price * Object.keys(voyagers).length).toLocaleString()}
                </p>
              </div>
              {/* <div className="flex justify-between items-center text-red-600 font-semibold">
                <p className="text-lg py-2">Room Discount</p>
                <p>฿ -7,500</p>
              </div> */}
            </div>

            <div className="flex justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl mt-4 text-white">
              <div className="flex flex-col">
                <p className="text-sm font-bold">Total Payment</p>
                <p className="text-3xl font-bold">
                  $
                  {(trip.price * Object.keys(voyagers).length).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="btn bg-white text-indigo-700 hover:bg-indigo-100 rounded-full px-4 transition duration-300 flex items-center"
                  onClick={updateCart}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save
                </button>
                <button className="btn bg-white text-indigo-700 hover:bg-indigo-100 rounded-full px-4 transition duration-300 flex items-center">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showMedal && (
        <div
          className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg`}
        >
          {showMedal === 'green'
            ? `Changes have been saved`
            : `There was an error saving your changes. Please try again.`}
        </div>
      )}

      {/* DaisyUI Modal */}
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

export default UserCartEditPage;
