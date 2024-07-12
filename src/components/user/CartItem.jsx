import React, { memo } from 'react';

const CartItem = memo(
  ({
    cartItemId,
    id,
    title = '',
    imageSrc = '',
    departure = '',
    departureDate = '',
    destination = '',
    arrivalDate = '',
    duration = 0,
    voyagerCount = 0,
    total = 0,
    onDelete,
    onCheckboxChange,
    isChecked = false,
  }) => {
    CartItem.displayName = 'CartItem';
    return (
      <div
        className="card bg-base-100 shadow-xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body">
          <div className="card-title justify-between">
            <h2 className="text-xl md:text-xl font-semibold">{title}</h2>
            <button
              className="btn btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cartItemId);
              }}
            >
              x
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="flex items-center mb-4 md:mb-0">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-6"
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation();
                  onCheckboxChange(cartItemId);
                }}
              />
              <img
                src={imageSrc}
                alt={title}
                className="rounded-3xl hidden md:block w-64"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap justify-center md:justify-center items-center gap-4 md:gap-8 py-4 px-4 md:px-8">
                <div className="flex flex-col items-center">
                  <p className="font-bold text-lg">{departure}</p>
                  <p className="badge badge-ghost p-4">{departureDate}</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/planeBlue.svg" alt="Plane" />
                  <p className="text-error mt-2">{`(${duration ?? 0} days ${
                    (duration ?? 1) - 1
                  } nights)`}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="font-bold text-lg">{destination}</p>
                  <p className="badge badge-ghost p-4">{arrivalDate}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-8 px-4 md:px-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <h2 className="text-2xl text-info p">No. of Voyagers</h2>
                  <div className="w-7 h-7 ml-2 mr-2 rounded-full bg-blue-500 text-white font-bold text-xl flex items-center justify-center">
                    {voyagerCount}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 md:gap-6 text-2xl md:text-3xl font-bold">
                  <p>Total</p>
                  <p className="text-gray-800">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CartItem;
