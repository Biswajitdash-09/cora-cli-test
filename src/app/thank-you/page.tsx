"use client";

import Link from "next/link";
import { useMemo } from "react";

import { formatCurrency, ORDER_STORAGE_KEY, parseStoredOrder } from "@/lib/product-types";

export default function ThankYouPage() {
  const submittedOrder = useMemo(() => {
    const storedOrder = parseStoredOrder(window.localStorage.getItem(ORDER_STORAGE_KEY));

    if (storedOrder === null) {
      window.localStorage.removeItem(ORDER_STORAGE_KEY);
    }

    return storedOrder;
  }, []);

  if (submittedOrder === null) {
    return (
      <main className="checkout-page">
        <section className="checkout-shell thank-you-shell" aria-labelledby="thank-you-heading">
          <p className="section-heading__eyebrow">Order confirmation unavailable</p>
          <h1 id="thank-you-heading">No confirmed order found.</h1>
          <p>Return to the store, add a product, and complete checkout to view an order confirmation.</p>
          <div className="thank-you-actions">
            <Link href="/" className="button button--primary">
              Continue shopping
            </Link>
            <Link href="/checkout" className="button button--secondary">
              Back to checkout
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const shippingMethod = submittedOrder.shippingMethod === "pickup" ? "Apple Store pickup" : "Standard delivery";

  return (
    <main className="checkout-page">
      <section className="checkout-shell thank-you-shell" aria-labelledby="thank-you-heading">
        <p className="section-heading__eyebrow">Order confirmed</p>
        <h1 id="thank-you-heading">Thanks for your order.</h1>
        <p>
          Order <strong>{submittedOrder.orderNumber}</strong> has been prepared for {submittedOrder.email}. We&apos;ll send updates as your Apple India demo order moves forward.
        </p>

        <div className="checkout-grid">
          <section className="checkout-card">
            <h2>Delivery summary</h2>
            <div className="checkout-summary-row">
              <span>Items</span>
              <strong>{submittedOrder.items}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Delivery method</span>
              <strong>{shippingMethod}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Estimate</span>
              <strong>{submittedOrder.deliveryEstimate}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Contact</span>
              <strong>{submittedOrder.fullName}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Email</span>
              <strong>{submittedOrder.email}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Address</span>
              <strong>
                {submittedOrder.address}, {submittedOrder.city} {submittedOrder.postalCode}
              </strong>
            </div>
            {submittedOrder.promoCode && submittedOrder.promoDiscount > 0 ? (
              <div className="checkout-summary-row">
                <span>{submittedOrder.promoCode} applied</span>
                <strong>-{formatCurrency(submittedOrder.promoDiscount)}</strong>
              </div>
            ) : null}
            {submittedOrder.promoDescription ? <p className="checkout-submit-note">{submittedOrder.promoDescription}</p> : null}
            <div className="checkout-summary-row checkout-summary-row--total">
              <span>Total paid</span>
              <strong>{formatCurrency(submittedOrder.total)}</strong>
            </div>
          </section>

          <section className="checkout-card thank-you-actions">
            <h2>What next</h2>
            <p>Browse more products or return to the store to build another bag.</p>
            <Link href="/" className="button button--primary">
              Continue shopping
            </Link>
            <Link href="/#store" className="button button--secondary">
              Back to store section
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
