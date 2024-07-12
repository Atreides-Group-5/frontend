import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

function NotFound() {
  return (
    <div className="min-h-screen bg-cover bg-[url('/bg-desktop.webp')] py-8 px-4 md:py-16 md:px-8 lg:px-16 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl">
        <div className="text-center p-8 md:p-12">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold">
              404
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            We've searched high and low, but couldn't find the page you're
            looking for.
            <br className="hidden md:inline" />
            Let's get you back on track to your perfect adventure!
          </p>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to="/"
              className="btn bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 rounded-full px-6 py-3 transition duration-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return Home
            </Link>
            <Link
              to="/search"
              className="btn bg-white text-indigo-700 border-2 border-indigo-500 hover:bg-indigo-50 rounded-full px-6 py-3 transition duration-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search Trips
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 md:p-8">
          <p className="text-center text-indigo-800 font-semibold">
            Need assistance? Contact our support team at{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@voyage.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
