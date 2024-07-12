import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CouponManage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/coupons/');
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        const data = await response.json();
        const couponsData = data.coupons.map((coupon) => ({
          _id: coupon._id,
          name: coupon.name,
          type: coupon.type,
          discount: coupon.discount,
          code: coupon.code,
          minimumPurchaseAmount: coupon.minimumPurchaseAmount,
        }));
        setCoupons(couponsData);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/coupons/${selectedCoupon._id}`
      );
      setCoupons(coupons.filter((c) => c._id !== selectedCoupon._id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const CouponItem = ({ coupon }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row md:justify-between md:items-center"
    >
      <div className="mb-2 md:mb-0">
        <h3 className="font-semibold text-lg">{coupon.name}</h3>
        <p className="text-xl text-gray-500 mt-1">{'Code: ' + coupon.code}</p>
        <p className="text-sm text-gray-600">{'Type: ' + coupon.type}</p>
        <p className="text-blue-600 font-bold text-lg">
          {`${coupon.discount} ${coupon.type === 'fixed' ? 'USD' : '%'}`}
        </p>
        <p className="text-xs text-gray-500">
          {'Min. Purchase: ' +
            coupon.minimumPurchaseAmount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
        </p>
      </div>
      <div>
        <Link
          to={`/admin/edit-coupon/${coupon._id}`}
          className="btn btn-sm btn-outline btn-primary mr-2"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Link>
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={() => handleDeleteClick(coupon)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Coupons</h1>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search coupons..."
            className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <Link
          to="/admin/create-coupon"
          className="btn bg-blue-500 text-white mb-6"
        >
          Create New Coupon
        </Link>

        {isLoading ? (
          <p>Loading coupons...</p>
        ) : coupons.length > 0 ? (
          coupons
            .filter((coupon) =>
              coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((coupon) => <CouponItem key={coupon._id} coupon={coupon} />)
        ) : (
          <p>No coupons available.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete the coupon "{selectedCoupon?.name}
              "?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManage;
