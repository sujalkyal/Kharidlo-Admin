"use client";

import { useEffect, useState } from "react";
import { 
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sales/getAllOrders`);
        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/getAllUsers`);
        setOrders(ordersResponse.data.orders || []);
        setUsers(usersResponse.data.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;

  const salesTrendData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existing = acc.find((entry) => entry.date === date);
    if (existing) {
      existing.sales += order.amount;
    } else {
      acc.push({ date, sales: order.amount });
    }
    return acc;
  }, []);

  const statusData = orders.reduce((acc, order) => {
    const existing = acc.find((entry) => entry.status === order.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ status: order.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ["#FF0000", "#D70000", "#B20000", "#8B0000"];

  return (
    <div className="p-8 bg-white min-h-screen font-sans text-black">
      <h2 className="text-4xl font-bold mb-8 text-red-500 text-center">Admin Dashboard</h2>
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[{ title: "Total Revenue", value: `$${totalRevenue}` }, { title: "Total Orders", value: totalOrders }, { title: "Total Users", value: totalUsers }].map((stat, index) => (
              <div key={index} className="bg-red-100 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
                <h3 className="text-xl font-semibold text-red-00">{stat.title}</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 shadow-lg p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <XAxis dataKey="date" stroke="#FF0000" />
                <YAxis stroke="#FF0000" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#FF0000" strokeWidth={3} dot={{ r: 6, fill: "#FF0000" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-100 shadow-lg p-8 rounded-xl">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={110} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
