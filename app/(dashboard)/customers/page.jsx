"use client";

import { useEffect, useState } from "react";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      try {
        // Fetch users
        const userRes = await fetch("/api/customers/getAllUsers");
        const userData = await userRes.json();
        const fetchedUsers = userData.users || [];

        // Fetch orders
        const orderRes = await fetch("/api/sales/getAllOrders");
        const orderData = await orderRes.json();
        const fetchedOrders = orderData.orders || [];

        setUsers(fetchedUsers);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndOrders();
  }, []);

  // Compute total orders and total value per user
  const getOrderStats = (userId) => {
    const userOrders = orders.filter((order) => order.userId === userId);
    const totalOrders = userOrders.length;
    const totalValue = userOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    return { totalOrders, totalValue };
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customers</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700 uppercase text-sm">
                <th className="p-4">Email</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const { totalOrders, totalValue } = getOrderStats(user.id);

                return (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{totalOrders}</td>
                    <td className="p-4">${totalValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
