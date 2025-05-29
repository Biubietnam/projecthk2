"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Button from "../../components/Button"
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState(new Set())
  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCartItems(response.data.items)
      setTotalAmount(response.data.total_amount)
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(itemId))

    try {
      const token = localStorage.getItem("access_token")
      await axios.put(
        `http://localhost:8000/api/cart/update/${itemId}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      await fetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId))

    try {
      const token = localStorage.getItem("access_token")
      await axios.delete(`http://localhost:8000/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      await fetchCart()
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const incrementQuantity = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1)
  }

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700 mt-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded shadow-sm">
<div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700 mt-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="w-8 h-8" /> Your Cart
        {cartItems.length > 0 && (
          <span className="text-lg font-normal text-gray-500">
            ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </span>
        )}
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-200">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/gearshop"
            className="inline-block px-8 py-3 bg-customPurple text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            {cartItems.map((item, index) => (
              <div key={item.id} className={`p-6 ${index !== cartItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div
                  className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${updatingItems.has(item.id) ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.gear.main_image ? (
                        <img
                          src={item.gear.main_image || "/placeholder.svg"}
                          alt={item.gear.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
<h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.gear.name}</h2>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.gear.description}</p>
                      <p className="text-xl font-bold text-green-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (value && value > 0) {
                            updateQuantity(item.id, value)
                          }
                        }}
                        className="w-16 border border-gray-300 rounded-md text-center text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent"
                        disabled={updatingItems.has(item.id)}
                      />
                      <button
                        onClick={() => incrementQuantity(item.id, item.quantity)}
                        disabled={updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updatingItems.has(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {updatingItems.has(item.id) && (
<div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-customPurple border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-right sm:text-left">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalAmount)}
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  to="/gearshop"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Continue Shopping
                </Link>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="px-8 py-3 bg-customPurple text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}