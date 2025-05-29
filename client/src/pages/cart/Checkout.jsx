import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { FaMoneyBillAlt, FaCreditCard } from "react-icons/fa"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe("pk_test_51RPkKYCksw0msKNEl8oiXWfeBxczpThjgO7hriExdGjHg8MDg7WO5E411S68j00H34IqtziW8CKdGHNngFTFNAO100r6z6QPiv")

function MoMoIcon() {
    return (
        <img
            src="/img/momo_square_pinkbg.svg"
            alt="MoMo Logo"
            className="w-7 h-7"
        />
    );
}


function CheckoutForm({ totalAmount, onSuccess, onCancel }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isReady, setIsReady] = useState(false)

    const handleReady = () => {
        setIsReady(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements || !isReady) {
            return
        }

        setIsLoading(true)
        setErrorMessage("")

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            })

            if (error) {
                setErrorMessage(error.message || "An error occurred during payment.")
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                onSuccess(paymentIntent)
            } else {
                setErrorMessage("Something went wrong with your payment.")
            }
        } catch (err) {
            console.error("Payment confirmation error:", err)
            setErrorMessage("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement onReady={handleReady} />
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <div className="flex gap-2 mt-4">
                <Button type="submit" className="w-full" disabled={isLoading || !stripe || !elements || !isReady}>
                    {isLoading ? "Processing..." : "Pay Now"}
                </Button>
                <Button type="button" className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

export default function Checkout() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "cod",
    })
    const [cartItems, setCartItems] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const [showStripeModal, setShowStripeModal] = useState(false)
    const [stripeLoading, setStripeLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("access_token")
                const response = await axios.get("https://thoriumstudio.xyz/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setCartItems(response.data.items)
                setTotalAmount(response.data.total_amount)
            } catch (error) {
                console.error("Error loading cart:", error)
            }
        }

        fetchCart()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access_token")
                const response = await axios.get("https://thoriumstudio.xyz/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.data) {
                    setFormData({
                        ...formData,
                        fullName: response.data.full_name,
                        email: response.data.email,
                        phone: response.data.phone,
                        address: response.data.address,
                    })
                }
            } catch (error) {
                console.error("Error loading profile:", error)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handlePaymentMethodSelect = async (method) => {
        setFormData({ ...formData, paymentMethod: method })
        console.log("Selected payment method:", method)
        if (method === "card") {
            setStripeLoading(true)
            try {
                const token = localStorage.getItem("access_token")
                const response = await axios.post(
                    "https://thoriumstudio.xyz/api/create-payment-intent",
                    {
                        amount: Math.round(totalAmount * 100),
                        items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
                        customer: {
                            fullName: formData.fullName,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                        },
                        paymentMethod: formData.paymentMethod,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setClientSecret(response.data.clientSecret)
                setShowStripeModal(true)
            } catch (error) {
                console.error("Error creating payment intent:", error)
                alert("Failed to initialize payment. Please try again.")
            } finally {
                setStripeLoading(false)
            }
        } else {
            setShowStripeModal(false)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.paymentMethod === "card") {
            handlePaymentMethodSelect("card")
            return
        }
        if (formData.paymentMethod === "cod") {
            setSubmitting(true)
            try {
                const token = localStorage.getItem("access_token")
                const resp = await axios.post(
                    "https://thoriumstudio.xyz/api/create-order",
                    {
                        items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
                        customer: {
                            fullName: formData.fullName,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                        },
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const orderId = resp.data.transaction_id
                navigate(`/thank-you?order=${orderId}`)
            } catch (err) {
                console.error("COD order failed:", err)
                alert("❌ Failed to place cash order. Please try again.")
            } finally {
                setSubmitting(false)
            }
        }
    }

    const handlePaymentSuccess = async (paymentIntent) => {
        setShowStripeModal(false)


        try {
            const token = localStorage.getItem("access_token")
            const resp = await axios.post(
                "https://thoriumstudio.xyz/api/confirm-payment",
                {
                    payment_intent_id: paymentIntent.id,
                    items: cartItems.map(i => ({ id: i.id, quantity: i.quantity }))
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const orderId = resp.data.transaction_id;
            alert("🎉 Payment successful! Order placed.")
            navigate(`/thank-you?order=${orderId}`);
        } catch (err) {
            console.error("Failed to save receipt:", err)
        }

    }

    const handlePaymentCancel = () => {
        setShowStripeModal(false)
    }

    const paymentOptions = [
        { value: "cod", label: "Cash on Delivery", icon: <FaMoneyBillAlt className="text-green-600 text-2xl" /> },
        { value: "card", label: "Credit/Debit Card", icon: <FaCreditCard className="text-blue-600 text-2xl" /> },
        { value: "Momo", label: "Momo", icon: <MoMoIcon className="text-yellow-600 text-2xl" /> },
    ]

    // Stripe Elements appearance options
    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: "#0570de",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#df1b41",
            fontFamily: "Ideal Sans, system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
        },
    }

    // Stripe Elements options
    const stripeOptions = clientSecret
        ? {
            clientSecret,
            appearance,
        }
        : null

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <h1 className="text-3xl mb-6 text-center">Checkout</h1>
            <div className="mb-2">
                <Link
                    to="/cart"
                    className="inline-flex items-center rounded text-sm text-customPurple hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-1 h-4 w-4"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Cart
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 hover w-full">
                <div className="bg-white p-6 rounded shadow space-y-4 lg:basis-1/2 w-full hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl mb-4">Order Summary</h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <ul className="min-w-full divide-y divide-gray-200 text-sm">
                            <li className="bg-gray-50 grid grid-cols-3  text-gray-700 px-4 py-2">
                                <span className="text-left">Product</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-right">Subtotal</span>
                            </li>

                            {cartItems.map((item) => (
                                <li key={item.id} className="grid grid-cols-3 items-center px-4 py-2">
                                    <span className="truncate text-gray-900">{item.gear.name}</span>
                                    <span className="text-center text-gray-700">x{item.quantity}</span>
                                    <span className="text-right font-medium text-gray-900">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(item.price * item.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t pt-4 text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="font-medium">Subtotal</span>
                            <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-6 rounded shadow hover:shadow-lg transition-shadow duration-300 lg:basis-1/2 w-full"
                >
                    <h2 className="text-xl  mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <div className="flex flex-col gap-4">
                            {paymentOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handlePaymentMethodSelect(option.value)}
                                    className={`flex items-center gap-3 px-4 py-3 border rounded w-full text-left 
                                    ${formData.paymentMethod === option.value
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300 bg-white"
                                        } hover:shadow-md`}
                                    disabled={stripeLoading && option.value === "card"}
                                >
                                    {option.icon}
                                    <span className="text-sm font-medium">
                                        {stripeLoading && option.value === "card" ? "Loading payment form..." : option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Button type="submit" className="w-full" disabled={submitting || stripeLoading}>
                            {submitting ? "Placing Order..." : "Place Order"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Stripe Payment Modal */}
            {showStripeModal && clientSecret && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl mb-4">Complete Your Payment</h3>
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <CheckoutForm totalAmount={totalAmount} onSuccess={handlePaymentSuccess} onCancel={handlePaymentCancel} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    )
}
