import { useState, useContext } from 'react';
import classnames from 'classnames';
import MyTripsComponent from './MyTripsComponent';
import UserContext from './UserContext';

const tabs = [
  { name: 'Pending', label: 'Pending' },
  { name: 'Completed', label: 'Completed' },
  { name: 'Cancelled', label: 'Cancelled' },
];

const TabContent = ({ activeTab, user }) => {
  switch (activeTab) {
    case 'Pending':
    case 'Completed':
    case 'Cancelled':
      return <MyTripsComponent user={user} activeTab={activeTab} />;
    default:
      return null;
  }
};

function UserBookingPage() {
  const [activeTab, setActiveTab] = useState('Pending');
  const { user } = useContext(UserContext);

  return (
    <section className="md:bg-gray-100 md:pb-80">
      <div className="hidden md:flex md:justify-start">
        <p className="text-4xl font-bold py-4 pl-[10%]">My Trips</p>
      </div>
      <ul className="menu menu-horizontal bg-white font-bold shadow-lg text-xl md:w-[80%] md:rounded-xl p-0 flex m-auto">
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className={classnames(
              'hover:text-[#5F97FB] flex-grow flex items-center',
              { 'text-[#5F97FB]': activeTab === tab.name }
            )}
            onClick={() => setActiveTab(tab.name)}
          >
            <a>{tab.label}</a>
          </li>
        ))}
      </ul>

      <div className="mx-4 md:mx-48 md:mt-11 md:border-t md:border-gray-300 h-[50vh]">
        <TabContent activeTab={activeTab} user={user} />
      </div>
    </section>
  );
}

export default UserBookingPage;
