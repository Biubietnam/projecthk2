import { Check, Calendar, CreditCard, Package, Printer, Home } from "lucide-react"
import Button from "../../components/Button"

export default function Receipt({
  orderId,
  date,
  paymentMethod,
  total,
  items,
  customer,
  shopInfo,
}) {
  const storedName = localStorage.getItem("user_info.Name")
  const storedEmail = localStorage.getItem("user_info.email")
  const cust = customer || {
    name: storedName || "",
    email: storedEmail || "",
  }
  console.log(items)
  const shop = shopInfo || {
    name: "Pet Shop",
    address: "123 Pet Street, Animalville",
    phone: "(555) 123-4567",
    email: "info@pawsomepets.com",
  }

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 print:shadow-none">
        {/* Success Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Check className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl  text-gray-800">Order Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Shop Info */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center">
            <div>
              <h2 className=" text-lg text-[#6D7AB5]">{shop.name}</h2>
              <p className="text-sm text-gray-600">{shop.phone}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div className="flex items-center justify-end mb-1">
              <Home className="w-4 h-4 mr-1" />
              <span>{shop.address}</span>
            </div>
            <p>{shop.email}</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{date}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Package className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
          </div>
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{paymentMethod}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer</p>
<p className="font-medium">{cust.name}</p>
<p className="text-sm text-gray-600">{cust.email}</p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-b py-4 mb-4">
          <h3 className="font-semibold mb-3">Purchase Summary</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price*item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between  text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center mt-8">
          <Button onClick={handlePrint} className="flex items-center" position="auto">
            <Printer className="w-5 h-5 mr-2" />
            Print Receipt
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Thank you for shopping at {shop.name}!</p>
          <p className="mt-1">Your furry friends will love their new goodies.</p>
        </div>
      </div>
    </div>
  )
}