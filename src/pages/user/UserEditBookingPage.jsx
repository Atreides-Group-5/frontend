import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { format, addDays } from 'date-fns';

const TripAccordion = ({ trip, isOpen, toggleAccordion }) => {
  return (
    <div className="mb-6">
      <div
        className="flex justify-between items-center bg-indigo-100 rounded-t-xl p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h2 className="text-xl font-bold text-indigo-800">{trip.title}</h2>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && (
        <div className="border border-indigo-100 border-t-0 rounded-b-xl p-4">
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md mb-4">
            <div className="flex-col flex items-center">
              <p className="font-extrabold text-xl text-indigo-700">
                {trip.departure}
              </p>
              <p className="font-bold bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 mt-2">
                {format(trip.departureDate, 'EEE d MMM')}
              </p>
            </div>
            <div className="flex-col flex items-center">
              <img
                src="/planeBlue.svg"
                alt="Plane icon"
                className="w-10 h-10"
              />
              <p className="font-semibold text-red-500 mt-2">
                ({trip.duration})
              </p>
            </div>
            <div className="flex-col flex items-center">
              <p className="font-extrabold text-xl text-indigo-700">
                {trip.destination}
              </p>
              <p className="font-bold bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 mt-2">
                {format(
                  addDays(trip.departureDate, trip.durationDays),
                  'EEE d MMM'
                )}
              </p>
            </div>
          </div>
          <p className="text-lg font-normal py-4 text-gray-700">
            {trip.description}
          </p>
          <h3 className="text-xl font-bold text-indigo-800 mt-4 mb-2">
            Voyagers
          </h3>
          {trip.voyagers.map((voyager, index) => (
            <div key={index} className="border-b border-gray-200 py-2">
              <p className="text-lg">
                Voyager {index + 1}: {voyager}
              </p>
            </div>
          ))}
          <div className="mt-4">
            <h3 className="text-xl font-bold text-indigo-800 mb-2">
              Trip Cost
            </h3>
            <div className="flex justify-between items-center font-semibold text-gray-700">
              <p className="text-lg">
                {trip.package} x {trip.voyagers.length}
              </p>
              <p>฿ {trip.cost.toLocaleString()}</p>
            </div>
            {trip.discount > 0 && (
              <div className="flex justify-between items-center text-red-600 font-semibold">
                <p className="text-lg">Discount</p>
                <p>฿ -{trip.discount.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UserEditBookingPage = () => {
  const [openAccordions, setOpenAccordions] = useState([]);

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Mock data for multiple trips
  const bookingData = {
    bookingId: 'B12345',
    trips: [
      {
        id: 1,
        title: 'Japan Trip: Okinawa Package',
        departure: 'Bangkok',
        destination: 'Okinawa',
        departureDate: new Date(2024, 4, 9),
        duration: '4 Days 3 Nights',
        durationDays: 3,
        description:
          'Okinawa package including flights, accommodation, restaurants, and Churaumi Aquarium tickets. 24/7 personal assistant service.',
        voyagers: ['John Doe', 'Jane Smith'],
        package: 'Package Okinawa A',
        cost: 59900,
        discount: 7500,
      },
      {
        id: 2,
        title: 'Thailand Trip: Phuket Getaway',
        departure: 'Bangkok',
        destination: 'Phuket',
        departureDate: new Date(2024, 5, 15),
        duration: '3 Days 2 Nights',
        durationDays: 2,
        description:
          'Phuket package including flights, beachfront resort, island hopping tour, and Thai cooking class.',
        voyagers: ['John Doe'],
        package: 'Phuket Paradise Package',
        cost: 25000,
        discount: 2000,
      },
    ],
  };

  const totalCost = bookingData.trips.reduce((sum, trip) => sum + trip.cost, 0);
  const totalDiscount = bookingData.trips.reduce(
    (sum, trip) => sum + trip.discount,
    0
  );
  const finalTotal = totalCost - totalDiscount;

  return (
    <div className="min-h-screen bg-[url('/bg-desktop.webp')] py-8 px-4 md:py-16 md:px-48">
      <section className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold pb-10 text-indigo-700">
            Booking Details
          </h1>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            Booking Summary
          </h2>
          <p className="text-lg">
            <strong>Booking ID:</strong> {bookingData.bookingId}
          </p>
          <p className="text-lg">
            <strong>Total Trips:</strong> {bookingData.trips.length}
          </p>
        </div>
        {bookingData.trips.map((trip, index) => (
          <TripAccordion
            key={trip.id}
            trip={trip}
            isOpen={openAccordions.includes(index)}
            toggleAccordion={() => toggleAccordion(index)}
          />
        ))}
        <div className="rounded-3xl shadow-lg px-8 py-6 mb-6 bg-white">
          <h2 className="text-2xl font-extrabold py-4 text-indigo-800">
            Total Payment Information
          </h2>
          <div className="flex justify-between items-center font-semibold text-gray-700">
            <p className="text-lg py-2">Total Package Cost</p>
            <p>฿ {totalCost.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-red-600 font-semibold">
            <p className="text-lg py-2">Total Discount</p>
            <p>฿ -{totalDiscount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl mt-4 text-white">
          <div className="flex flex-col">
            <p className="text-sm font-bold">Total Payment</p>
            <p className="text-3xl font-bold">
              ฿ {finalTotal.toLocaleString()}
            </p>
          </div>
          <button className="btn bg-red-500 hover:bg-red-600 text-white rounded-full text-xl px-8 transition duration-300">
            Cancel Booking
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserEditBookingPage;
