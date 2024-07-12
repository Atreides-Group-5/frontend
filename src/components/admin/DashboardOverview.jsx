import React from 'react';

function DashboardOverview() {
  const stats = [
    { name: 'Total Sales', value: '$15,231', change: '+2.5%', changeType: 'increase' },
    { name: 'Active Users', value: '1,234', change: '+15%', changeType: 'increase' },
    { name: 'Conversion Rate', value: '3.2%', change: '-0.4%', changeType: 'decrease' },
    { name: 'Avg. Order Value', value: '$86', change: '+$3', changeType: 'increase' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div key={item.name} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">{item.name}</h3>
          <p className="text-3xl font-bold mt-2">{item.value}</p>
          <p className={`text-sm mt-2 ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {item.change} from last month
          </p>
        </div>
      ))}
    </div>
  );
}

export default DashboardOverview;