import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTicketAlt, FaShoppingCart, FaChartBar, FaSignOutAlt, FaBars } from 'react-icons/fa';
import UserContext from '../../context/UserContext';
import DashboardOverview from '../../components/admin/DashboardOverview';
import PackageTripManage from '../../components/admin/PackageTripManage';
import CouponManage from '../../components/admin/CouponManage';
import OrderManage from '../../components/admin/OrderManage';

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaChartBar />, onClick: () => setActiveMenu('dashboard') },
    { id: 'packageTrips', name: 'Package Trips', icon: <FaBox />, onClick: () => setActiveMenu('packageTrips') },
    { id: 'coupons', name: 'Coupons', icon: <FaTicketAlt />, onClick: () => setActiveMenu('coupons') },
    { id: 'orders', name: 'Orders', icon: <FaShoppingCart />, onClick: () => setActiveMenu('orders') },
    { id: 'logout', name: 'Logout', icon: <FaSignOutAlt />, onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'packageTrips':
        return <PackageTripManage />;
      case 'coupons':
        return <CouponManage />;
      case 'orders':
        return <OrderManage />;
      default:
        return <DashboardOverview />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white shadow-md h-full`}>
        <div className="p-4 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-2 text-left ${
                activeMenu === item.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => {
                item.onClick();
                setIsSidebarOpen(false);
              }}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            {menuItems.find(item => item.id === activeMenu)?.name}
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;