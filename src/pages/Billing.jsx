import React, { useEffect, useState } from "react";
import "../App.css"

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ---------------- FETCH CURRENT SUBSCRIPTION ----------------
  const fetchSubscription = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/billing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      console.error("Failed to load subscription");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // ---------------- CREATE PAYMENT ORDER ----------------
  const subscribe = async (plan) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const order = await res.json();

      openRazorpay(order, plan);
    } catch (err) {
      alert("Payment system will be enabled soon!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RAZORPAY CHECKOUT ----------------
  const openRazorpay = (order, plan) => {
    const options = {
      key: "RAZORPAY_KEY_ID", // 🔑 replace with env key
      amount: order.amount,
      currency: "INR",
      name: "Your App Name",
      description: `${plan} Subscription`,
      order_id: order.id,

      handler: async function (response) {
        await verifyPayment(response);
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ---------------- VERIFY PAYMENT ----------------
  const verifyPayment = async (response) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/payment/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Subscription activated 🎉");
        fetchSubscription();
      }
    } catch {
      alert("Payment verification failed");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 max-w-5xl mx-auto flex gap-[50px]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="text-gray-500">Manage your subscription & payments</p>
      </div>

      {/* Current Plan */}
      {subscription && (
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Current Plan</h2>
          <p className="mt-2">
            <span className="font-medium">{subscription.plan}</span>{" "}
            <span className="text-sm text-gray-500">
              ({subscription.status})
            </span>
          </p>

          {subscription.expiresAt && (
            <p className="text-sm text-gray-500 mt-1">
              Expires on{" "}
              {new Date(subscription.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Plans */}
      <div className="flex gap-[60px]">
        {/* FREE */}
        <PlanCard
          title="Free"
          price="₹0"
          features={["Basic usage", "Limited AI access"]}
          disabled
        />

        {/* PRO */}
        <PlanCard
          title="Pro"
          price="₹499 / month"
          features={[
            "Unlimited AI",
            "Priority support",
          ]}
          onClick={() => subscribe("Pro")}
          loading={loading}
        />

        {/* PREMIUM */}
        <PlanCard
          title="Premium"
          price="₹999 / month"
          features={[
            "Everything in Pro",
            "1-on-1 Support",
          ]}
          onClick={() => subscribe("Premium")}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Billing;

// ---------------- PLAN CARD ----------------
const PlanCard = ({
  title,
  price,
  features,
  onClick,
  loading,
  disabled,
}) => (
  <div className="bg-white rounded-xl p-6 shadow space-y-4 pr-[10px] pl-[10px] ">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{price}</p>

    <ul className="text-gray-600 space-y-1">
      {features.map((f, i) => (
        <li key={i}> {f}</li>
      ))}
    </ul>

    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full py-2 rounded-xl text-white mb-[12px] ${
        disabled
          ? "disabledcolor"
          : "notdisabledcolor"
      }`}
    >
      {loading ? "Processing..." : disabled ? "Current Plan" : "Upgrade"}
    </button>
  </div>
);
