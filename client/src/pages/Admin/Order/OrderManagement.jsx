// Thuc - Order Management
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:8000/api/orders", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order created successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order.");
    }
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Shipping Fee</th>
              <th className="p-4">Shipping Address</th>
              <th className="p-4">Note</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.user_id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs inline-block ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 capitalize">{order.payment_method.replace(/_/g, ' ')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs inline-block ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4">${order.total_amount}</td>
                  <td className="p-4">${order.shipping_fee}</td>
                  <td className="p-4 whitespace-pre-wrap max-w-xs">{order.shipping_address}</td>
                  <td className="p-4 whitespace-pre-wrap max-w-sm text-xs text-gray-600">{order.note}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => alert(`Cancel order #${order.id}`)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
