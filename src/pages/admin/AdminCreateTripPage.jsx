import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TripForm from '../../components/admin/TripForm';

function AdminCreateTripPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'sub_expenses') {
          data[key].forEach((exp, index) => {
            formData.append(
              `sub_expenses[${index}][expense_name]`,
              exp.expense_name
            );
            formData.append(
              `sub_expenses[${index}][expense_amount]`,
              exp.expense_amount
            );
          });
        } else if (key === 'image') {
          formData.append('images', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post(
        'http://localhost:3000/api/trips/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('Trip created:', response.data);
      setSuccessMessage('Trip created successfully!');
    } catch (error) {
      console.error('Error creating trip:', error);
      setErrorMessage('Error creating trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={handleBack}
          className="mb-4 btn btn-outline btn-primary"
        >
          Back
        </button>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-3xl font-bold text-white">Create New Trip</h2>
            <p className="text-blue-100 mt-2">
              Fill in the details to create an exciting new trip!
            </p>
          </div>
          <TripForm onSubmit={onSubmit} />
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

export default AdminCreateTripPage;
