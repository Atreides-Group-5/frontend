import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

function PassengerModal({
  currentVoyager,
  voyagers,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) {
  const [firstName, setFirstName] = useState(
    voyagers[currentVoyager]?.firstName || ''
  );
  const [lastName, setLastName] = useState(
    voyagers[currentVoyager]?.lastName || ''
  );

  useEffect(() => {
    setFirstName(voyagers[currentVoyager]?.firstName || '');
    setLastName(voyagers[currentVoyager]?.lastName || '');
  }, [currentVoyager, voyagers]);

  const handleSave = () => {
    if (firstName && lastName) {
      onSave({ firstName, lastName });
      onClose();
    } else {
      alert('Please fill in both first name and last name');
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <dialog
      id="passenger_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <form method="dialog" className="modal-box bg-white rounded-2xl">
        <h3 className="font-bold text-2xl mb-4 text-indigo-800">
          Enter Voyager {currentVoyager} Information
        </h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-700">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input input-bordered focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-gray-700">Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input input-bordered focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="modal-action flex justify-end space-x-2 mt-6">
          <button
            className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
            onClick={handleSave}
            title="Save"
          >
            <FontAwesomeIcon
              icon={faSave}
              className="text-indigo-500 text-xl"
            />
          </button>
          <button
            className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
            onClick={handleDelete}
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-400 text-xl" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={onClose}
            title="Cancel"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-400 text-xl" />
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default PassengerModal;
