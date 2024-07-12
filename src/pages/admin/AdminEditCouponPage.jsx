import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import axios from 'axios';

function AdminEditCouponPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const type = useWatch({ control, name: 'type' }); // Watch for type changes

  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/coupons/${id}`
        );
        const couponData = response.data.coupon;

        // Set values for all keys dynamically
        Object.keys(couponData).forEach((key) => {
          setValue(key, couponData[key]);
        });
      } catch (error) {
        console.error('Error fetching coupon data:', error);
        setErrorMessage('Error fetching coupon data. Please try again.');
      }
    };

    fetchCouponData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Prepare updatedCoupon object
      const updatedCoupon = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) {
          acc[key] =
            key === 'discount' || key === 'minimumPurchaseAmount'
              ? parseFloat(data[key])
              : data[key];
        }
        return acc;
      }, {});

      const response = await axios.put(
        `http://localhost:3000/api/coupons/${id}`,
        updatedCoupon,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Coupon updated:', response.data);
      setSuccessMessage('Coupon updated successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error updating coupon:', error);
      setErrorMessage('Error updating coupon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-3xl font-bold text-white">Edit Coupon</h2>
            <p className="text-blue-100 mt-2">
              Update the details of your coupon!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Name */}
              <div className="form-control">
                <label
                  htmlFor="name"
                  className="label text-gray-700 font-semibold"
                >
                  Coupon Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.name ? 'input-error' : ''
                  }`}
                  {...register('name', { required: 'Coupon name is required' })}
                  placeholder="Enter coupon name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Coupon Code */}
              <div className="form-control">
                <label
                  htmlFor="code"
                  className="label text-gray-700 font-semibold"
                >
                  Coupon Code
                </label>
                <input
                  id="code"
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.code ? 'input-error' : ''
                  }`}
                  {...register('code', {
                    required: 'Coupon code is required',
                    minLength: {
                      value: 6,
                      message: 'Coupon code must be at least 6 characters long',
                    },
                    maxLength: {
                      value: 6,
                      message: 'Coupon code must be at most 6 characters long',
                    },
                  })}
                  placeholder="Enter coupon code (6 characters)"
                />
                {errors.code && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </span>
                )}
              </div>

              {/* Coupon Type */}
              <div className="form-control">
                <label
                  htmlFor="type"
                  className="label text-gray-700 font-semibold"
                >
                  Coupon Type
                </label>
                <select
                  id="type"
                  className={`select select-bordered w-full ${
                    errors.type ? 'select-error' : ''
                  }`}
                  {...register('type', { required: 'Coupon type is required' })}
                >
                  <option value="">Select type</option>
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percent</option>
                </select>
                {errors.type && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </span>
                )}
              </div>

              {/* Discount */}
              <div className="form-control">
                <label
                  htmlFor="discount"
                  className="label text-gray-700 font-semibold"
                >
                  Discount
                </label>
                <input
                  id="discount"
                  type="number"
                  step={type === 'percent' ? 0.01 : 1} // Adjust step based on type
                  className={`input input-bordered w-full ${
                    errors.discount ? 'input-error' : ''
                  }`}
                  {...register('discount', {
                    required: 'Discount is required',
                    min: {
                      value: type === 'percent' ? 1 : 0,
                      message:
                        type === 'percent'
                          ? 'Discount must be at least 1%'
                          : 'Discount must be at least 0',
                    },
                    max: {
                      value: type === 'percent' ? 100 : undefined,
                      message: 'Discount cannot exceed 100%',
                    },
                  })}
                  placeholder="Enter discount"
                />
                {errors.discount && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.discount.message}
                  </span>
                )}
              </div>

              {/* Minimum Purchase Amount */}
              <div className="form-control">
                <label
                  htmlFor="minimumPurchaseAmount"
                  className="label text-gray-700 font-semibold"
                >
                  Minimum Purchase Amount
                </label>
                <input
                  id="minimumPurchaseAmount"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full ${
                    errors.minimumPurchaseAmount ? 'input-error' : ''
                  }`}
                  {...register('minimumPurchaseAmount', {
                    required: 'Minimum purchase amount is required',
                    min: {
                      value: 0,
                      message:
                        'Minimum purchase amount must be greater than or equal to 0',
                    },
                  })}
                  placeholder="Enter minimum purchase amount"
                />
                {errors.minimumPurchaseAmount && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.minimumPurchaseAmount.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Coupon'
              )}
            </button>
          </form>
        </div>
        {successMessage && (
          <div className="alert alert-success mt-6">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-error mt-6">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default AdminEditCouponPage;
