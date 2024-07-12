import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

function TripForm({ onSubmit, initialData = {}, isEditing = false }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    defaultValues: {
      name: initialData.name || '',
      duration_days: initialData.duration_days || '',
      destination_from: initialData.destination_from || '',
      destination_to: initialData.destination_to || '',
      rating: initialData.rating || 0,
      description: initialData.description || '',
      sub_expenses: initialData.sub_expenses || [],
      image: initialData.images ? initialData.images[0] : null, // ใช้รูปภาพแรกจาก array
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sub_expenses',
  });

  const [image, setImage] = useState(
    initialData.images ? initialData.images[0] : null
  );
  const [imageError, setImageError] = useState('');

  const watchRating = watch('rating');
  const currentRating = parseFloat(watchRating || 0).toFixed(1);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const subExpenses = getValues('sub_expenses');
    const newTotalPrice = subExpenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.expense_amount) || 0);
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [fields, getValues]); // Trigger the effect when fields change

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setImageError('Only JPG, PNG, and WebP formats are allowed');
        return;
      }
      setImage(file);
      setImageError('');
    }
  };

  const handleFormSubmit = async (data) => {
    if (!image && !isEditing) {
      setImageError('Please upload an image');
      return;
    }
    await onSubmit({ ...data, price: totalPrice, image }); // ส่ง image เดี่ยว
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label htmlFor="name" className="label text-gray-700 font-semibold">
            Trip Name
          </label>
          <input
            id="name"
            type="text"
            className={`input input-bordered w-full ${
              errors.name ? 'input-error' : ''
            }`}
            {...register('name', { required: 'Trip name is required' })}
            placeholder="Enter trip name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label
            htmlFor="duration_days"
            className="label text-gray-700 font-semibold"
          >
            Duration (days)
          </label>
          <input
            id="duration_days"
            type="number"
            className={`input input-bordered w-full ${
              errors.duration_days ? 'input-error' : ''
            }`}
            {...register('duration_days', {
              required: 'Duration is required',
              min: 1,
            })}
            placeholder="Enter duration in days"
          />
          {errors.duration_days && (
            <span className="text-red-500 text-sm mt-1">
              {errors.duration_days.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label
            htmlFor="destination_from"
            className="label text-gray-700 font-semibold"
          >
            From
          </label>
          <input
            id="destination_from"
            type="text"
            className={`input input-bordered w-full ${
              errors.destination_from ? 'input-error' : ''
            }`}
            {...register('destination_from', {
              required: 'Origin is required',
            })}
            placeholder="Enter origin"
          />
          {errors.destination_from && (
            <span className="text-red-500 text-sm mt-1">
              {errors.destination_from.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label
            htmlFor="destination_to"
            className="label text-gray-700 font-semibold"
          >
            To
          </label>
          <input
            id="destination_to"
            type="text"
            className={`input input-bordered w-full ${
              errors.destination_to ? 'input-error' : ''
            }`}
            {...register('destination_to', {
              required: 'Destination is required',
            })}
            placeholder="Enter destination"
          />
          {errors.destination_to && (
            <span className="text-red-500 text-sm mt-1">
              {errors.destination_to.message}
            </span>
          )}
        </div>
      </div>

      {/* Description Text Area */}
      <div className="form-control">
        <label
          htmlFor="description"
          className="label text-gray-700 font-semibold"
        >
          Description
        </label>
        <textarea
          id="description"
          className="textarea textarea-bordered h-32 w-full"
          {...register('description')}
          placeholder="Describe the trip..."
        ></textarea>
      </div>

      {/* Rating Input with Scale */}
      <div className="form-control">
        <label htmlFor="rating" className="label text-gray-700 font-semibold">
          Rating: <span className="text-blue-600 ml-2">{currentRating}</span>
        </label>
        <input
          id="rating"
          type="range"
          min="0"
          max="5"
          step="0.1"
          className="range range-primary"
          {...register('rating')}
        />
        <div className="w-full flex justify-between text-xs px-2 mt-2">
          {[0, 1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex flex-col items-center">
              <div className="h-2 border-l border-gray-300"></div>
              <span className="mt-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Expenses Section */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-lg text-gray-700">Sub Expenses</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-grow"
                placeholder="Expense Name"
                {...register(`sub_expenses.${index}.expense_name`, {
                  required: 'Expense name is required',
                })}
              />
              <input
                type="number"
                className="input input-bordered input-sm w-24"
                placeholder="Amount"
                {...register(`sub_expenses.${index}.expense_amount`, {
                  required: 'Expense amount is required',
                  pattern: /^\d+(\.\d{1,2})?$/, // Corrected pattern
                })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-ghost btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ expense_name: '', expense_amount: '' })}
            className="btn btn-primary btn-sm mt-2"
          >
            Add Expense
          </button>

          {/* Display total price under Sub Expenses */}
          <div className="mt-4 text-lg font-semibold">
            Total Price:{' '}
            <span className="text-blue-600 ml-2">{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="form-control">
        <label htmlFor="image" className="label text-gray-700 font-semibold">
          Upload Image
        </label>
        {image && (
          <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt="Trip Image"
            className="w-full h-auto mb-2"
          />
        )}
        <input
          id="image"
          type="file"
          onChange={handleImageUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="file-input file-input-bordered w-full"
        />
        {imageError && (
          <span className="text-red-500 text-sm mt-1">{imageError}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary w-full text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : isEditing ? (
          'Update Trip'
        ) : (
          'Create Trip'
        )}
      </button>
    </form>
  );
}

export default TripForm;
