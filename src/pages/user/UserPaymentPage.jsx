import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

function UserPaymentPage() {
  const [user, setUser] = useState(null);
  const [orderFromCart, setOrderFromCart] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePayment = (creditCardDetail) => {
    const modal = document.getElementById('payment_process');
    if (creditCardDetail && modal) {
      modal.showModal();
      setTimeout(() => {
        setUser((prevUser) => ({
          ...prevUser,
          orders: prevUser.orders.map((order) =>
            order.orderId === orderFromCart.orderId
              ? { ...order, orderStatus: 'Completed' }
              : order
          ),
        }));
        navigate('/payment-success');
      }, 3000);
    }
  };

  useEffect(() => {
    if (user && user.orders && orderFromCart) {
      console.log('Order from Cart:', orderFromCart);
    }
  }, [user, orderFromCart]);

  const handleExpirationChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    event.target.value = value;
  };

  const handleCvvChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    event.target.value = value.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-[url('/bg-desktop.webp')] py-8 px-4 md:py-16 md:px-48">
      <section className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold pb-10 text-indigo-700">
            Payment Details
          </h1>
        </div>
        <div className="md:flex md:space-x-8">
          <form className="md:w-1/2" onSubmit={handleSubmit(handlePayment)}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text text-lg font-semibold text-indigo-800">
                  Full name (as displayed on card)*
                </span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full bg-indigo-50"
                {...register('fullName', { required: true })}
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm pt-1">
                  กรุณากรอกชื่อและนามสกุลให้ถูกต้อง
                </span>
              )}
            </div>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text text-lg font-semibold text-indigo-800">
                  Card number*
                </span>
              </label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="input input-bordered w-full bg-indigo-50"
                {...register('cardNumber', {
                  required: true,
                  onChange: (e) => {
                    const { value } = e.target;
                    const numericValue = value.replace(/\D/g, '');
                    const formattedValue = numericValue
                      .replace(/(\d{4})/g, '$1-')
                      .slice(0, 19);
                    e.target.value = formattedValue;
                  },
                })}
              />
              {errors.cardNumber && (
                <span className="text-red-500 text-sm pt-1">
                  กรุณากรอกหมายเลขบัตรให้ถูกต้อง
                </span>
              )}
            </div>
            <div className="flex justify-between space-x-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text text-lg font-semibold text-indigo-800">
                    Card expiration*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input input-bordered w-full bg-indigo-50"
                  {...register('expiration', {
                    required: true,
                    onChange: handleExpirationChange,
                    pattern: /^\d{2}\/\d{2}$/,
                  })}
                />
                {errors.expiration && (
                  <span className="text-red-500 text-sm pt-1">
                    กรุณากรอกวันหมดอายุให้ถูกต้อง (MM/YY)
                  </span>
                )}
              </div>
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text text-lg font-semibold text-indigo-800">
                    CVV*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="input input-bordered w-full bg-indigo-50"
                  {...register('cvv', {
                    required: true,
                    maxLength: 3,
                    pattern: /^\d{3}$/,
                    onChange: handleCvvChange,
                  })}
                />
                {errors.cvv && (
                  <span className="text-red-500 text-sm pt-1">
                    กรุณากรอก CVV ให้ถูกต้อง (3 หลัก)
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full mt-8 text-lg font-semibold"
            >
              Pay now
            </button>
          </form>

          {user && user.orders && orderFromCart && (
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-indigo-50 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-extrabold mb-4 text-indigo-800">
                  Order Summary
                </h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">Original price:</span>
                  <span className="text-lg font-semibold">
                    ฿{orderFromCart.OrderOriginalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">Discount:</span>
                  <span className="text-lg font-semibold text-red-500">
                    -฿{orderFromCart.OrderDiscount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-indigo-200 my-4"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-indigo-800">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-indigo-800">
                    ฿{orderFromCart.OrderTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <img src="/paypal.svg" alt="PayPal" className="h-8" />
                  <img src="/visa.svg" alt="Visa" className="h-8" />
                  <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <dialog id="payment_process" className="modal">
        <div className="modal-box bg-white p-6 rounded-xl shadow-xl">
          <h3 className="font-bold text-2xl text-indigo-700 mb-4">
            Processing your payment
          </h3>
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default UserPaymentPage;
