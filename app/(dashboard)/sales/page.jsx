"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, X, CheckCircle } from "lucide-react";
import { Dialog } from "@headlessui/react";

const SalesPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/sales/getAllOrders"); // Update with your API route
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const getTotalItems = (order) => {
        return order.products.reduce((total, product) => total + product.quantity, 0);
    };

    const completeOrder = async () => {
        if (!selectedOrder) return;
        try {
            await axios.put(`/api/sales/completeOrder`, {
                orderId: selectedOrder.id,
                status: "completed"
            });
            setOrders(prevOrders => prevOrders.map(order => order.id === selectedOrder.id ? { ...order, status: "completed" } : order));
            closeModal();
        } catch (error) {
            console.error("Failed to complete order:", error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sales Orders</h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr className="text-left text-gray-700 uppercase text-sm">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="p-4">{order.id}</td>
                                    <td className="p-4">{order.userId}</td>
                                    <td className="p-4">${order.amount || 0}</td>
                                    <td className={`p-4 text-sm font-medium capitalize 
                                        ${order.status === "completed" ? "text-green-600" : "text-red-600"}`}>
                                        {order.status}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => openModal(order)}
                                            className="p-2 rounded-full hover:bg-gray-200 transition"
                                        >
                                            <MoreVertical size={20} className="text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Order Details */}
            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-center">
                            <Dialog.Title className="text-xl font-semibold">Order Details</Dialog.Title>
                            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        {selectedOrder && (
                            <div className="mt-4 space-y-2 text-gray-700">
                                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                <p><strong>Customer:</strong> {selectedOrder.userId}</p>
                                <p><strong>Total:</strong> ${selectedOrder.amount}</p>
                                <p><strong>Items:</strong> {getTotalItems(selectedOrder)}</p>
                                <button
                                    onClick={completeOrder}
                                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} /> Complete Order
                                </button>
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default SalesPage;
