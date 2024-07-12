import { useContext, useEffect, useState, useRef } from 'react';
import { cartLengthAtom } from '../atoms/cartAtom';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { fetchCart } from '../utils/cartUtils';
import { useAtom } from 'jotai';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [cartLength, setCartLength] = useAtom(cartLengthAtom);

  useEffect(() => {
    setIsLogin(user !== null);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getCartData = async () => {
      try {
        const { cartLength } = await fetchCart();
        setCartLength(cartLength);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (user && !user.isAdmin) {
      getCartData();
    }
  }, [user, setCartLength]);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to={user?.isAdmin ? '/admin' : '/'}
              className="flex items-center"
            >
              <img className="w-40" src="/voyageLogo.webp" alt="Voyage Logo" />
            </Link>
          </div>

          <div className="flex items-center">
            {isLogin ? (
              <div className="flex items-center space-x-4">
                {!user?.isAdmin && (
                  <Link
                    to="/cart"
                    className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View cart</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartLength}
                    </span>
                  </Link>
                )}

                {!user?.isAdmin ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="flex items-center max-w-xs rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      id="user-menu-button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={toggleDropdown}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user?.profilePicture || '/user/profile.jpg'}
                        alt=""
                      />
                      <span className="ml-2 text-sm font-medium hidden md:inline-block">
                        {user?.firstname || 'User'}
                      </span>
                      <svg
                        className={`ml-1 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* Dropdown menu */}
                    {isOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[60]"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex="-1"
                      >
                        <Link
                          to="/member"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Cart
                        </Link>
                        <Link
                          to="/booking"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden"></div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
