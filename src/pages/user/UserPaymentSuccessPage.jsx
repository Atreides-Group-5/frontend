import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
const UserPaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-[url('/bg-desktop.webp')] bg-cover bg-center py-8 px-4 md:py-16 md:px-48 flex items-center justify-center">
      <section className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">
            Thank You!
          </h1>
          <div className="mb-8">
            <FaCheckCircle className="mx-auto text-green-500 text-6xl" />
          </div>
          <p className="text-2xl font-bold text-indigo-800 mb-4">
            Payment Successful
          </p>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed. You will receive a confirmation
            email shortly.
          </p>
          <div className="space-y-4">
            <Link
              to="/booking"
              className="btn btn-primary w-full text-lg font-semibold"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="btn btn-outline btn-primary w-full text-lg font-semibold"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserPaymentSuccessPage;
