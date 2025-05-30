import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Loader2,
  Printer,
} from "lucide-react"
import Button from "../../components/Button"

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get(`https://thoriumstudio.xyz/api/get-receipts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("Order response:", response.data)
        setOrder(response.data)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order details. Please try again.")
      } finally {
        console.log("Order data fetched:", order)
        setLoading(false)
      }
    }

    if (id) {
      fetchOrderDetail()
    }
  }, [id, navigate])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "text-green-600"
      case "processing":
      case "shipped":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getShippingStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "shipped":
      case "in_transit":
        return <Truck className="w-5 h-5 text-blue-600" />
      case "processing":
        return <Package className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || "Order not found"}</div>
          <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        </div>
      </div>
    )
  }

  const shop = order.shopInfo || {
    name: "Pet Shop",
    address: "123 Pet Street, Animalville",
    phone: "(555) 123-4567",
    email: "info@pawsomepets.com",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => navigate("/orders")} className="flex items-center mb-4" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.transaction_id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getShippingStatusIcon(order.shipping_status)}
                  <div>
                    <p className="font-medium capitalize">{order.shipping_status?.replace("_", " ") || "Processing"}</p>
                  </div>
                </div>
                {order.transaction_id && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-medium">{order.transaction_id}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">${item.unit} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.unit * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(order.date_issued).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{order.payment_status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium capitalize ${getStatusColor(order.shipping_status)}`}>
                      {order.shipping_status || "Processing"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{order.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
