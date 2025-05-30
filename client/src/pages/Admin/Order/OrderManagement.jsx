import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
export default function OrderManagement() {
  const [orders, setOrders] = useState([]);       // always start as an array
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        "https://thoriumstudio.xyz/api/admin/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      console.log("Fetched orders:", data);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      await axios.post(
        `https://thoriumstudio.xyz/api/admin/order/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      toast.success("Order cancelled successfully!")
      await fetchOrders()
    } catch (err) {
      console.error("Error cancelling order:", err)
      toast.error("Failed to cancel order")
    }
  }


  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
      <div className="mb-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Order Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-4">Txn ID</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Address</th>
              <th className="p-4">Contact</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const txnId = order.transaction_id;
                const userId = order.user_id;
                const status = order.shipping_status.toLowerCase();
                const payStatus = order.payment_status.toLowerCase();
                const total = order.amount.toFixed(2);
                const address = order.address;
                const contact = order.number || order.email || "";

                return (
                  <tr key={txnId} className="border-t hover:bg-gray-50">
                    <td className="p-4">{txnId}</td>
                    <td className="p-4">{userId}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs inline-block ${status === "ordered" ? "bg-yellow-100 text-yellow-800" :
                          status === "processing" ? "bg-blue-100 text-blue-800" :
                            status === "shipped" ? "bg-purple-100 text-purple-800" :
                              status === "delivered" ? "bg-green-100 text-green-800" :
                                status === "cancelled" ? "bg-red-100 text-red-800" :
                                  "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs inline-block ${payStatus === "paid" ? "bg-green-100 text-green-800" :
                          payStatus === "cash" ? "bg-blue-100 text-blue-800" :
                            payStatus === "refunded" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {payStatus}
                      </span>
                    </td>
                    <td className="p-4">${total}</td>
                    <td className="p-4 whitespace-pre-wrap max-w-xs">{address}</td>
                    <td className="p-4">{contact}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/order/${txnId}`}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        >
                          View
                        </Link>

                        {status === "ordered" && (
                          <button
                            onClick={() => handleCancelOrder(txnId)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
