import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Receipt from "./Receipt";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadReceipt() {
      try {
        const token = localStorage.getItem("access_token");
        const resp = await axios.get(
          `http://localhost:8002/api/receipts/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReceiptData(resp.data);
      } catch (err) {
        console.error("Failed to load receipt:", err);
        alert("Could not load your receipt. Contact support.");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadReceipt();
  }, [orderId]);

  if (loading) return <div>Loading your receipt…</div>;
  if (!receiptData) return <div>Order not found.</div>;

  return <Receipt {...receiptData} />;
}