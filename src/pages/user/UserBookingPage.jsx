// UserBookingPage.jsx
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { bookingsAtom, activeTabAtom } from '../../atoms/bookingAtoms';
import { fetchBookings } from '../../utils/bookingUtils';

function TripCard({ trip, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold">{trip.title}</h3>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="flex flex-col md:flex-row">
            <img
              src={trip.imageSrc}
              alt={trip.title}
              className="w-full md:w-1/3 rounded-lg mb-4 md:mb-0 md:mr-4"
            />
            <div className="flex-1">
              <p>
                <span className="font-semibold">From:</span> {trip.departure}
              </p>
              <p>
                <span className="font-semibold">To:</span> {trip.destination}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {trip.duration}
              </p>
              <p>
                <span className="font-semibold">Voyagers:</span>{' '}
                {trip.voyagerCount}
              </p>
              <p className="text-right mt-2 font-semibold">
                Amount: ${trip.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingStatus({ status }) {
  let statusText = '';
  let statusStyle = '';

  switch (status) {
    case 'pending':
      statusText = 'Awaiting for payment';
      statusStyle = 'badge badge-warning';
      break;
    case 'completed':
      statusText = 'Payment completed';
      statusStyle = 'badge badge-info';
      break;
    case 'cancelled':
      statusText = 'Canceled';
      statusStyle = 'badge badge-error';
      break;
    default:
      statusText = 'Unknown';
      break;
  }

  return <p className={`py-1 px-2 rounded ${statusStyle}`}>{statusText}</p>;
}

function UserBookingPage() {
  const [bookings, setBookings] = useAtom(bookingsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [expandedTrips, setExpandedTrips] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBookings = await fetchBookings(activeTab);
        setBookings(fetchedBookings);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getBookings();
  }, [activeTab, setBookings]);

  const toggleTripExpansion = (bookingId, tripId) => {
    setExpandedTrips((prev) => ({
      ...prev,
      [`${bookingId}-${tripId}`]: !prev[`${bookingId}-${tripId}`],
    }));
  };

  const tabs = [
    { name: 'pending', label: 'Pending' },
    { name: 'completed', label: 'Completed' },
    { name: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <section className="md:bg-gray-100 md:pb-80">
      <div className="hidden md:flex md:justify-start">
        <p className="text-4xl font-bold py-4 pl-[10%]">My Bookings</p>
      </div>
      <ul className="menu menu-horizontal bg-white font-bold shadow-lg text-xl md:w-[80%] md:rounded-xl p-0 flex m-auto">
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className={`hover:text-[#5F97FB] flex-grow flex items-center ${
              activeTab === tab.name ? 'text-[#5F97FB]' : ''
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            <a>{tab.label}</a>
          </li>
        ))}
      </ul>

      <div className="mx-4 md:mx-48 md:mt-11 md:border-t md:border-gray-300">
        {isLoading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white mt-2 rounded-2xl shadow-md p-6 md:p-6 my-4"
            >
              <BookingStatus status={booking.booking_status} />
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 font-bold">
                  Booking ID: {booking._id}
                </p>
                <p className="text-gray-500 text-sm">
                  จองเมื่อ{' '}
                  {new Date(booking.booked_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  {new Date(booking.booked_at).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  น.
                </p>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  Total Amount: $
                  {booking.booked_trips
                    .reduce((total, trip) => total + trip.trip.price, 0)
                    .toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Number of Trips: {booking.booked_trips.length}
                </p>
              </div>
              {booking.booked_trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={{
                    id: trip._id,
                    imageSrc: trip.trip.image,
                    title: trip.trip.name,
                    departure: trip.trip.destination_from,
                    destination: trip.trip.destination_to,
                    duration: `${trip.trip.duration_days} days`,
                    voyagerCount: trip.travelers.length,
                    amount: trip.trip.price,
                  }}
                  isExpanded={expandedTrips[`${booking._id}-${trip._id}`]}
                  onToggle={() => toggleTripExpansion(booking._id, trip._id)}
                />
              ))}
              {booking.coupon && (
                <p className="text-green-600 mt-2">
                  Coupon applied: {booking.coupon.code} ($
                  {booking.coupon.discount_amount} discount)
                </p>
              )}
              <p className="text-gray-500 text-sm mt-4">
                We recommend you arrive at the airport at least 2 hours before
                departure to allow ample time for check-in.
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/female-guide.webp" alt="" className="w-1/2" />
            <p className="items-center text-center just text-xl font-semibold ">
              No adventures in this status yet! Let's find you a new one to get
              excited about.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserBookingPage;
