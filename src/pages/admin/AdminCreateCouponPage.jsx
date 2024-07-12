import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminCreateCouponPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      type: '',
      discount: '',
      minimumPurchaseAmount: '',
    },
  });

  const type = useWatch({ control, name: 'type' }); // Watch for type changes

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const coupon = {
        ...data,
        discount: parseFloat(data.discount),
        minimumPurchaseAmount: parseFloat(data.minimumPurchaseAmount),
      };

      const response = await axios.post(
        'http://localhost:3000/api/coupons/',
        coupon
      );
      setSuccessMessage('Coupon created successfully!');
    } catch (error) {
      console.error('Error creating coupon:', error);
      setErrorMessage('Error creating coupon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-3xl font-bold text-white">Create New Coupon</h2>
            <p className="text-blue-100 mt-2">
              Fill in the details to create a new coupon!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {...register('code', { required: 'Coupon code is required' })}
                  placeholder="Enter coupon code"
                />
                {errors.code && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </span>
                )}
              </div>
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
              <div className="form-control">
                <label
                  htmlFor="discount"
                  className="label text-gray-700 font-semibold"
                >
                  Discount
                </label>
                <input
                  id="discount"
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.discount ? 'input-error' : ''
                  }`}
                  {...register('discount', {
                    required: 'Discount is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Please enter a valid discount',
                    },
                    validate: {
                      betweenDiscount: (value) => {
                        const selectedType = watch('type');
                        if (selectedType === 'percent') {
                          if (
                            !value ||
                            isNaN(value) ||
                            value < 1 ||
                            value > 100
                          ) {
                            return 'Discount must be between 1 and 100';
                          }
                        }
                        return true;
                      },
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
                  step="0.01" // Allow decimals for amounts
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
                  Creating...
                </>
              ) : (
                'Create Coupon'
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

export default AdminCreateCouponPage;
