"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"
import toast from "react-hot-toast"

export default function AOrderDetail() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        shipping_status: "",
        number: "",
        address: "",
        email: "",
    })

    const shippingStatusOptions = ["ORDERED", "SHIPPING", "SHIPPED", "CANCEL", "REFUND"]

    const fetchOrderDetail = async () => {
        try {
            const token = localStorage.getItem("access_token")
            const response = await axios.get(`http://localhost:8000/api/admin/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const orderData = response.data
            console.log("Fetched order detail:", orderData)
            setOrder(orderData)

            // Initialize form data with current order values
            setFormData({
                shipping_status: orderData.shipping_status || "",
                number: orderData.number || "",
                address: orderData.address || "",
                email: orderData.email || "",
            })
        } catch (err) {
            console.error("Error fetching order detail:", err)
            toast.error("Failed to fetch order details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchOrderDetail()
        }
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem("access_token")
            await axios.patch(`http://localhost:8000/api/admin/order/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            toast.success("Order updated successfully!")

            await fetchOrderDetail()
        } catch (err) {
            console.error("Error updating order:", err)
            toast.error("Failed to update order")
        } finally {
            setSaving(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return
        }

        try {
            const token = localStorage.getItem("access_token")
            await axios.post(
                `http://localhost:8000/api/admin/order/${id}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            )

            toast.success("Order cancelled successfully!")
            await fetchOrderDetail()
        } catch (err) {
            console.error("Error cancelling order:", err)
            toast.error("Failed to cancel order")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading order details...</div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
                <div className="mb-2">
                    <Link
                        to="/admin/ordermanagement"
                        className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
                    >
                        ← Back to Order Management
                    </Link>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Order not found</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
            <div className="mb-2">
                <Link to="/admin/ordermanagement" className="inline-flex items-center rounded text-sm text-customPurple hover:underline">
                    ← Back to Order Management
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl">Order Details - {order.transaction_id}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={handleCancelOrder}
                        disabled={order.shipping_status !== "ORDERED"}
                        className={`px-4 py-2 rounded transition text-white
        ${order.shipping_status !== "ORDERED"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        Cancel Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                            <div className="text-gray-900">{order.transaction_id}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <div className="text-gray-900">{order.user_id}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <div className="text-gray-900">${order.amount?.toFixed(2)}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                            <span
                                className={`px-2 py-1 rounded text-xs inline-block ${order.payment_status?.toLowerCase() === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : order.payment_status?.toLowerCase() === "cash"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.payment_status?.toLowerCase() === "refunded"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {order.payment_status}
                            </span>
                        </div>
                        {order.created_at && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                <div className="text-gray-900">{new Date(order.created_at).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editable Fields */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Editable Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Status</label>
                            <select
                                name="shipping_status"
                                value={formData.shipping_status}
                                onChange={handleInputChange}
                                disabled={order.shipping_status === "CANCEL" || order.shipping_status === "REFUND"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Status</option>
                                {shippingStatusOptions.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        disabled={
                                            (status.shipping_status === "SHIPPED" || status.shipping_status === "SHIPPING") && status === "ORDERED"
                                        }
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter shipping address"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items (if available) */}
            {order.items && order.items.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase">
                                <tr>
                                    <th className="p-3">Product</th>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3">${Number(item.unit).toFixed(2)}</td>

                                        <td className="p-3">${(item.quantity * item.unit)?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}