"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import {
  formatCurrency,
  getDeliveryEstimate,
  getEstimatedTax,
  getOrderTotal,
  getPromoDescription,
  getPromoDiscount,
  getShippingTotal,
  isValidPostalCode,
  normalizePromoCode,
  ORDER_STORAGE_KEY,
  type PromoCode,
  type ShippingMethod,
  type SubmittedOrder,
} from "@/lib/product-types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm: {
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: ShippingMethod;
} = {
  email: "",
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  shippingMethod: "delivery",
};

export default function CheckoutPage() {
  const { cartItems, cartCount, cartTotal, clearCart, updateQuantity } = useCart();
  const [formValues, setFormValues] = useState(initialForm);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldIds = {
    email: useId(),
    fullName: useId(),
    address: useId(),
    city: useId(),
    postalCode: useId(),
    promoCode: useId(),
  };
  const router = useRouter();

  const shippingTotal = useMemo(() => getShippingTotal(cartTotal), [cartTotal]);
  const estimatedTax = useMemo(() => getEstimatedTax(cartTotal), [cartTotal]);
  const deliveryEstimate = useMemo(
    () => getDeliveryEstimate(formValues.postalCode, formValues.shippingMethod),
    [formValues.postalCode, formValues.shippingMethod],
  );
  const promoDiscount = useMemo(() => getPromoDiscount(cartTotal, promoCode), [cartTotal, promoCode]);
  const promoDescription = useMemo(() => getPromoDescription(promoCode), [promoCode]);
  const finalShippingTotal = formValues.shippingMethod === "pickup" ? 0 : shippingTotal;
  const finalOrderTotal = useMemo(
    () => getOrderTotal(cartTotal, finalShippingTotal, estimatedTax, promoDiscount),
    [cartTotal, finalShippingTotal, estimatedTax, promoDiscount],
  );

  function handleChange(name: "shippingMethod", value: ShippingMethod): void;
  function handleChange(
    name: Exclude<keyof typeof initialForm, "shippingMethod">,
    value: string,
  ): void;
  function handleChange(name: keyof typeof initialForm, value: string | ShippingMethod) {
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(formValues.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formValues.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formValues.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!formValues.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!formValues.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    } else if (!isValidPostalCode(formValues.postalCode)) {
      nextErrors.postalCode = "Enter a valid 6-digit postal code.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function applyPromoCode() {
    const normalizedPromoCode = normalizePromoCode(promoInput);

    if (!promoInput.trim()) {
      setPromoCode(null);
      setPromoError(null);
      setPromoMessage("Enter a coupon code to apply savings or checkout guidance.");
      return;
    }

    if (!normalizedPromoCode) {
      setPromoCode(null);
      setPromoMessage(null);
      setPromoError("Enter a valid coupon code: STUDENT, TRADEIN, or NOEMI.");
      return;
    }

    setPromoCode(normalizedPromoCode);
    setPromoInput(normalizedPromoCode);
    setPromoError(null);
    setPromoMessage(
      normalizedPromoCode === "NOEMI"
        ? "Coupon applied. No Cost EMI details are now highlighted in your order summary."
        : `Coupon applied. ${formatCurrency(getPromoDiscount(cartTotal, normalizedPromoCode))} in savings is now included.`,
    );
  }

  function removePromoCode() {
    setPromoCode(null);
    setPromoInput("");
    setPromoError(null);
    setPromoMessage("Coupon removed. Order total updated.");
  }

  function placeOrder() {
    if (!validateForm() || cartItems.length === 0) {
      return;
    }

    const orderNumber = `APL-${Math.max(cartCount, 1)}${String(finalOrderTotal).padStart(4, "0")}`;
    const submittedOrder: SubmittedOrder = {
      orderNumber,
      email: formValues.email.trim(),
      fullName: formValues.fullName.trim(),
      address: formValues.address.trim(),
      city: formValues.city.trim(),
      postalCode: formValues.postalCode.trim(),
      total: finalOrderTotal,
      items: cartCount,
      shippingMethod: formValues.shippingMethod,
      deliveryEstimate: deliveryEstimate ?? "Delivery estimate will be shared after confirmation.",
      promoCode: promoCode ?? "",
      promoDiscount,
      promoDescription: promoDescription ?? "",
    };

    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(submittedOrder));
    clearCart();
    router.push("/thank-you");
  }

  return (
    <main className="checkout-page">
      <section className="checkout-shell" aria-labelledby="checkout-heading">
        <div className="checkout-shell__header">
          <p className="section-heading__eyebrow">Checkout</p>
          <h1 id="checkout-heading">Review your bag and complete your order.</h1>
          <p>Enter delivery details, confirm your totals in Indian rupees, and place a demo order from this concept checkout.</p>
        </div>

        <div className="checkout-grid">
          <section className="checkout-card" aria-labelledby="checkout-items-heading">
            <h2 id="checkout-items-heading">Bag summary</h2>
            {cartItems.length === 0 ? (
              <div className="checkout-empty-state">
                <p>Your bag is empty.</p>
                <Link href="/#store" className="button button--primary">
                  Browse the lineup
                </Link>
              </div>
            ) : (
              <ul className="checkout-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="checkout-line-item">
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.finish} · {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <div className="cart-line-item__controls">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.name}`}
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span aria-label={`Quantity for ${item.name}`}>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.name}`}
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="checkout-card" aria-labelledby="checkout-form-heading">
            <h2 id="checkout-form-heading">Shipping and contact</h2>
            <form className="checkout-form" onSubmit={(event) => event.preventDefault()} noValidate>
              <label className="checkout-field" htmlFor={fieldIds.email}>
                <span>Email</span>
                <input
                  id={fieldIds.email}
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
                />
                {errors.email ? <small id={`${fieldIds.email}-error`}>{errors.email}</small> : null}
              </label>
              <label className="checkout-field" htmlFor={fieldIds.fullName}>
                <span>Full name</span>
                <input
                  id={fieldIds.fullName}
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? `${fieldIds.fullName}-error` : undefined}
                />
                {errors.fullName ? <small id={`${fieldIds.fullName}-error`}>{errors.fullName}</small> : null}
              </label>
              <label className="checkout-field" htmlFor={fieldIds.address}>
                <span>Street address</span>
                <input
                  id={fieldIds.address}
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={errors.address ? `${fieldIds.address}-error` : undefined}
                />
                {errors.address ? <small id={`${fieldIds.address}-error`}>{errors.address}</small> : null}
              </label>
              <div className="checkout-field-row">
                <label className="checkout-field" htmlFor={fieldIds.city}>
                  <span>City</span>
                  <input
                    id={fieldIds.city}
                    type="text"
                    name="city"
                    value={formValues.city}
                    onChange={(event) => handleChange("city", event.target.value)}
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city ? `${fieldIds.city}-error` : undefined}
                  />
                  {errors.city ? <small id={`${fieldIds.city}-error`}>{errors.city}</small> : null}
                </label>
                <label className="checkout-field" htmlFor={fieldIds.postalCode}>
                  <span>Postal code</span>
                  <input
                    id={fieldIds.postalCode}
                    type="text"
                    name="postalCode"
                    value={formValues.postalCode}
                    onChange={(event) => handleChange("postalCode", event.target.value)}
                    aria-invalid={errors.postalCode ? "true" : "false"}
                    aria-describedby={errors.postalCode ? `${fieldIds.postalCode}-error` : undefined}
                  />
                  {errors.postalCode ? <small id={`${fieldIds.postalCode}-error`}>{errors.postalCode}</small> : null}
                </label>
              </div>
              <fieldset className="checkout-fieldset">
                <legend>Shipping method</legend>
                <label>
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={formValues.shippingMethod === "delivery"}
                    onChange={() => handleChange("shippingMethod", "delivery")}
                  />
                  Standard delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={formValues.shippingMethod === "pickup"}
                    onChange={() => handleChange("shippingMethod", "pickup")}
                  />
                  Apple Store pickup
                </label>
              </fieldset>
              <label className="checkout-field" htmlFor={fieldIds.promoCode}>
                <span>Promo code</span>
                <div className="checkout-promo-row">
                  <input
                    id={fieldIds.promoCode}
                    type="text"
                    name="promoCode"
                    placeholder="STUDENT, TRADEIN, or NOEMI"
                    value={promoInput}
                    onChange={(event) => {
                      setPromoInput(event.target.value);
                      setPromoError(null);
                      setPromoMessage(null);
                    }}
                    aria-invalid={promoError ? "true" : "false"}
                    aria-describedby={promoError ? `${fieldIds.promoCode}-error` : promoMessage ? `${fieldIds.promoCode}-message` : undefined}
                  />
                  <button type="button" className="button button--secondary" onClick={applyPromoCode}>
                    Apply coupon
                  </button>
                </div>
                {promoError ? <small id={`${fieldIds.promoCode}-error`}>{promoError}</small> : null}
                {promoMessage ? (
                  <p className="checkout-promo-note" id={`${fieldIds.promoCode}-message`}>
                    {promoMessage}
                  </p>
                ) : null}
                {promoCode ? (
                  <button type="button" className="button button--secondary checkout-promo-remove" onClick={removePromoCode}>
                    Remove coupon
                  </button>
                ) : null}
                {promoDescription ? <p className="checkout-promo-note">{promoDescription}</p> : null}
              </label>
            </form>
          </section>

          <aside className="checkout-card checkout-card--summary" aria-labelledby="order-summary-heading">
            <h2 id="order-summary-heading">Order summary</h2>
            <div className="checkout-summary-row">
              <span>Items</span>
              <strong>{cartCount}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <strong>{formValues.shippingMethod === "pickup" ? "Free" : formatCurrency(shippingTotal)}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Estimated tax</span>
              <strong>{formatCurrency(estimatedTax)}</strong>
            </div>
            {promoCode ? (
              <div className="checkout-summary-row">
                <span>Coupon</span>
                <strong>{promoCode}</strong>
              </div>
            ) : null}
            {promoCode && promoDiscount > 0 ? (
              <div className="checkout-summary-row">
                <span>Coupon savings</span>
                <strong>-{formatCurrency(promoDiscount)}</strong>
              </div>
            ) : null}
            <div className="checkout-summary-row checkout-summary-row--total">
              <span>Total</span>
              <strong>{formatCurrency(finalOrderTotal)}</strong>
            </div>
            {deliveryEstimate ? <p className="checkout-submit-note">{deliveryEstimate}</p> : null}
            <button
              type="button"
              className="button button--primary checkout-submit"
              disabled={cartItems.length === 0}
              aria-describedby={cartItems.length === 0 ? "checkout-submit-note" : undefined}
              onClick={placeOrder}
            >
              Place demo order
            </button>
            {cartItems.length === 0 ? (
              <p className="checkout-submit-note" id="checkout-submit-note">
                Add at least one product to your bag before placing a demo order.
              </p>
            ) : null}

            <Link href="/" className="button button--secondary checkout-back-link">
              Back to store
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
