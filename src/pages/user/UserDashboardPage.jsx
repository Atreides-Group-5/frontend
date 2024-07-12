import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useForm } from 'react-hook-form';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Constants
const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_AVATAR = '/user/profile.jpg';

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const UserDashboardPage = () => {
  const { user, setUser, login } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatedData, setUpdatedData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (user) {
      const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '';
      reset({
        firstName: user.firstname,
        lastName: user.lastname,
        dateOfBirth: formattedDate,
        country: user.country,
        phoneNumber: user.phone,
        email: user.email,
        gender: user.gender,
      });
    }
  }, [user, reset]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onSubmit = async (data) => {
    const updatedFields = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      country: data.country,
      phone: data.phoneNumber,
      ...(selectedImage && { profilePicture: selectedImage }),
    };

    setUpdatedData(updatedFields);
    setShowPasswordConfirm(true);
  };

  const handlePasswordConfirm = async () => {
    try {
      setPasswordError('');
      setIsUpdating(true);

      const loginResult = await login({
        email: user.email,
        password: password,
      });

      if (loginResult.success) {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');

        const res = await axios.put(
          `${API_BASE_URL}/profile/${user.id}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Response:', res);

        // Update user state with new data
        setUser({ ...user, ...updatedData });

        setShowPasswordConfirm(false);
        setPassword('');
        reset(updatedData);
        setUpdatedData(null);
        setSelectedImage(null);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error confirming password or updating profile:', error);
      setPasswordError('Invalid password or update failed. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formFields = useMemo(
    () => [
      {
        name: 'firstName',
        label: 'First name',
        required: 'First name is required',
      },
      {
        name: 'lastName',
        label: 'Last name',
        required: 'Last name is required',
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['male', 'female', 'other'],
      },
      {
        name: 'dateOfBirth',
        label: 'Date of birth',
        type: 'date',
        max: getCurrentDate(),
      },
      {
        name: 'phoneNumber',
        label: 'Phone number',
        required: 'Phone number is required',
        pattern: {
          value: /^\d{10}$/,
          message: 'Phone number must be 10 digits',
        },
      },
      { name: 'email', label: 'E-mail', type: 'email', disabled: true },
    ],
    []
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-8 bg-gray-50">
            <div className="text-center">
              <img
                src={selectedImage || user?.profilePicture || DEFAULT_AVATAR}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={triggerFileInput}
                className="btn btn-outline btn-sm mt-2"
              >
                Change Photo
              </button>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {user?.firstname} {user?.lastname}
              </h2>
            </div>
          </div>
          <div className="p-8 flex-grow">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Account Settings
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required ? '*' : ''}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        {...register(field.name)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-Select-</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        {...register(field.name, {
                          required: field.required,
                          pattern: field.pattern,
                        })}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          field.disabled ? 'bg-gray-100' : ''
                        }`}
                        disabled={field.disabled}
                        max={field.max}
                      />
                    )}
                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name].message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={(!isDirty && !selectedImage) || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      <dialog
        id="password_confirm_modal"
        className={`modal ${showPasswordConfirm ? 'modal-open' : ''}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Your Password</h3>
          <p className="py-4">
            Please enter your password to confirm the changes.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
          )}
          <div className="modal-action">
            <button
              onClick={handlePasswordConfirm}
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                'Confirm'
              )}
            </button>
            <button
              onClick={() => {
                setShowPasswordConfirm(false);
                setPassword('');
                setPasswordError('');
                setUpdatedData(null);
              }}
              className="btn"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserDashboardPage;
