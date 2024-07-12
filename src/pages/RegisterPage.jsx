import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosVisitor from '../utils/axiosVisitor';
import UserContext from '../context/UserContext';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [registrationError, setRegistrationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin' : '/');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
      };

      // Register the user
      const registerResponse = await axiosVisitor.post(
        '/users/register',
        userData
      );

      if (registerResponse.status === 201) {
        // If registration is successful, immediately log in the user
        const loginResult = await login({
          email: data.email,
          password: data.password,
        });

        if (loginResult.success) {
          navigate('/'); // Redirect to home page
        } else {
          setRegistrationError(
            'Registration successful, but automatic login failed. Please log in manually.'
          );
        }
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      if (error.response) {
        setRegistrationError(
          error.response.data.message || 'Registration failed.'
        );
      } else {
        setRegistrationError('An error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'firstName', type: 'text', placeholder: 'First Name' },
    { name: 'lastName', type: 'text', placeholder: 'Last Name' },
    { name: 'password', type: 'password', placeholder: 'Password' },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
    },
  ];

  if (user) {
    return null; // หรือแสดงข้อความ loading ในขณะที่ redirect
  }

  return (
    <div className="min-h-screen bg-center bg-cover bg-no-repeat bg-[url('/bg-desktop.webp')] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-500">
            Enjoy the trip with Voyage
          </h2>
          <p className="mt-2 text-center text-xl text-gray-900 font-semibold">
            Create a New Account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {inputFields.map((field, index) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="sr-only">
                  {field.placeholder}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.name}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    index === 0
                      ? 'rounded-t-md'
                      : index === inputFields.length - 1
                      ? 'rounded-b-md'
                      : ''
                  }`}
                  placeholder={field.placeholder}
                  {...register(field.name, {
                    required: `${field.placeholder} is required`,
                    ...(field.name === 'email' && {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }),
                    ...(field.name === 'password' && {
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
                      },
                    }),
                    ...(field.name === 'confirmPassword' && {
                      validate: (value) =>
                        value === getValues('password') ||
                        'Passwords do not match',
                    }),
                  })}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {registrationError && (
            <div className="text-red-500 text-sm text-center">
              {registrationError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
