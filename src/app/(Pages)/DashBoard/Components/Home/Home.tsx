"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/Utils/Context/AuthContext";
import { useRouter } from "next/navigation";
import {
  useFetchTotalMenus,
  useFetchTotalOrders,
  useFetchTotalCustomers,
  useFetchTotalRevenue,
  useFetchCompletedOrders,
} from "@/app/services/dashboardService";

// Define TypeScript Interfaces
interface OrderSummary {
  order_no: string;
  orders_id: number;
  customer_name: string;
  customer_phone: string;
  amount: string;
  status: string;
  totalItems?: number;
}


const DashBoardPage: React.FC = () => {
  const { user } = useAuth();

  // Add state for selected date
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // State management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;


  // Update date formatting to use selected date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    ).toString().padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formattedDate = formatDate(selectedDate);

  // Use React Query hooks
  const { data: menusData } = useFetchTotalMenus(user?.id || "");
  const { data: customersData } = useFetchTotalCustomers(user?.id || "", formattedDate);
  const { data: ordersData } = useFetchTotalOrders(user?.id || "", formattedDate);
  const { data: revenueData } = useFetchTotalRevenue(user?.id || "", formattedDate);
  const { data: completedOrdersData } = useFetchCompletedOrders(user?.id || "", formattedDate);

  // Transform completed orders data
  const completedOrders = completedOrdersData?.orders?.map((order: any) => ({
    order_no: order.order_number,
    orders_id: order.order_id,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    amount: `₹ ${order.net_amount}`,
    status: order.order_status,
    totalItems: order.order_item.length,
  })) || [];

  const totalPages = Math.ceil(completedOrders.length / itemsPerPage);
  const currentOrders = completedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative max-h-[100vh] overflow-y-auto p-4 mb-20">
      {/* Add date selector */}
      <div className="mb-6 flex items-center justify-end">
        <div><label htmlFor="date-selector" className="text-lg font-medium text-gray-800 mr-2">Select Date :</label>
        <input
          id="date-selector"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InfoCard title="Total Menu Items" value={menusData?.menuCount || 0} />
        <InfoCard title="Total Orders" value={ordersData?.totalOrders || 0} />
        <InfoCard title="Customers Served" value={customersData?.totalCustomers || 0} />
        <InfoCard title="Total Revenue" value={`₹ ${revenueData?.averageOrderAmount || 0}`} />
      </div>

      {/* Upcoming feature */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Revenue">
          <AreaChartComponent />
        </ChartCard>
        <ChartCard title="Weekly Revenue">
          <BarChartComponent />
        </ChartCard>
      </div> */}

      <OrdersTable orders={currentOrders} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

const InfoCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-slate-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg border-l-4 border-orange-500">
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium text-white uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-bold text-white font-sans">
        {value}
      </h2>
      
    </div>
  </div>
);

// const ChartCard: React.FC<{ title: string; children: React.ReactElement }> = ({ title, children }) => (
//   <div className="bg-white shadow rounded-lg p-4 h-[400px]">
//     <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
//     <div className="w-full h-[350px]">
//       <ResponsiveContainer width="100%" height="100%">
//         {children}
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const AreaChartComponent = () => (
//   <AreaChart data={hourlyRevenueData}>
//     <XAxis dataKey="hour" />
//     <YAxis />
//     <Tooltip />
//     <Area type="monotone" dataKey="revenue" stroke="#C2410C" fill="#F97316" />
//   </AreaChart>
// );

// const BarChartComponent = () => (
//   <BarChart data={weeklyRevenueData}>
//     <XAxis dataKey="week" />
//     <YAxis />
//     <Tooltip />
//     <Legend />
//     <Bar dataKey="revenue" fill="#4A90E2" />
//   </BarChart>
// );

const OrdersTable: React.FC<{ 
  orders: OrderSummary[]; 
  currentPage: number; 
  totalPages: number; 
  setCurrentPage: (page: number) => void 
}> = ({ orders, currentPage, totalPages, setCurrentPage }) => {
  const router = useRouter();

  const handleOrderClick = (orderId: number) => {
    router.push(`/Bill/?id=${orderId}`);
  };

  return (
    <div className="bg-gray-100 shadow rounded-lg p-4 mb-16">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Order List</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="border-b p-2">No</th>
              <th className="border-b p-2">Order No</th>
              <th className="border-b p-2">Customer Name</th>
              <th className="border-b p-2">Phone</th>
              <th className="border-b p-2">Items</th>
              <th className="border-b p-2">Amount</th>
              <th className="border-b p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? orders.map((order, index) => (
              <tr 
                key={order.orders_id}
                onClick={() => handleOrderClick(order.orders_id)}
                className="hover:bg-gray-200 bg-white cursor-pointer transition-colors"
              >
                <td className="border-b p-2">{index + 1}</td>
                <td className="border-b p-2">{order.order_no}</td>
                <td className="border-b p-2">{order.customer_name}</td>
                <td className="border-b p-2">{order.customer_phone}</td>
                <td className="border-b p-2">{order.totalItems}</td>
                <td className="border-b p-2">{order.amount}</td>
                <td className="border-b p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center py-4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DashBoardPage;
