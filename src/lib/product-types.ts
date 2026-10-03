export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  accent: string;
  finish: string;
  image: ProductImage;
  summary?: string;
  specs?: readonly string[];
  availability?: string;
  monthlyPriceNote?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type ShippingMethod = "delivery" | "pickup";
export type PromoCode = "STUDENT" | "TRADEIN" | "NOEMI";

export type SubmittedOrder = {
  orderNumber: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  items: number;
  shippingMethod: ShippingMethod;
  deliveryEstimate: string;
  promoCode: PromoCode | "";
  promoDiscount: number;
  promoDescription: string;
};

export const CART_STORAGE_KEY = "apple-clone-cart";
export const ORDER_STORAGE_KEY = "apple-clone-order";

const METRO_PREFIXES = new Set(["11", "12", "40", "50", "56", "60", "70", "80"]);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.description === "string" &&
    isFiniteNumber(item.price) &&
    typeof item.accent === "string" &&
    typeof item.finish === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function parseStoredCart(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.every(isCartItem) ? parsed : null;
  } catch {
    return null;
  }
}

export function isSubmittedOrder(value: unknown): value is SubmittedOrder {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const order = value as Partial<SubmittedOrder>;
  return (
    typeof order.orderNumber === "string" &&
    typeof order.email === "string" &&
    typeof order.fullName === "string" &&
    typeof order.address === "string" &&
    typeof order.city === "string" &&
    typeof order.postalCode === "string" &&
    typeof order.items === "number" &&
    Number.isInteger(order.items) &&
    order.items > 0 &&
    isFiniteNumber(order.total) &&
    typeof order.deliveryEstimate === "string" &&
    (order.promoCode === "" || order.promoCode === "STUDENT" || order.promoCode === "TRADEIN" || order.promoCode === "NOEMI") &&
    isFiniteNumber(order.promoDiscount) &&
    typeof order.promoDescription === "string" &&
    (order.shippingMethod === "delivery" || order.shippingMethod === "pickup")
  );
}

export function parseStoredOrder(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return isSubmittedOrder(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCartCount(cartItems: readonly CartItem[]) {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(cartItems: readonly CartItem[]) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getShippingTotal(subtotal: number) {
  if (subtotal === 0) {
    return 0;
  }

  if (subtotal >= 1000) {
    return 0;
  }

  return 29;
}

export function getEstimatedTax(subtotal: number) {
  return Math.round(subtotal * 0.08);
}

export function getOrderTotal(subtotal: number, shipping: number, tax: number, discount = 0) {
  return Math.max(0, subtotal + shipping + tax - discount);
}

export function isValidPostalCode(value: string) {
  return /^[1-9][0-9]{5}$/.test(value.trim());
}

export function getDeliveryEstimate(postalCode: string, shippingMethod: ShippingMethod) {
  if (shippingMethod === "pickup") {
    return "Ready for pickup after order confirmation.";
  }

  if (!isValidPostalCode(postalCode)) {
    return null;
  }

  const trimmedPostalCode = postalCode.trim();
  const prefix = trimmedPostalCode.slice(0, 2);

  if (METRO_PREFIXES.has(prefix)) {
    return "Delivers in 1–2 business days.";
  }

  return "Delivers in 3–5 business days.";
}

export function normalizePromoCode(value: string) {
  const normalizedValue = value.trim().toUpperCase();

  if (normalizedValue === "STUDENT" || normalizedValue === "TRADEIN" || normalizedValue === "NOEMI") {
    return normalizedValue;
  }

  return null;
}

export function getPromoDiscount(subtotal: number, promoCode: PromoCode | null) {
  if (subtotal <= 0 || !promoCode) {
    return 0;
  }

  if (promoCode === "STUDENT") {
    return 5000;
  }

  if (promoCode === "TRADEIN") {
    return 7000;
  }

  return 0;
}

export function getPromoDescription(promoCode: PromoCode | null) {
  if (promoCode === "STUDENT") {
    return "Education savings applied.";
  }

  if (promoCode === "TRADEIN") {
    return "Trade In credit applied.";
  }

  if (promoCode === "NOEMI") {
    return "No Cost EMI offer available at checkout with eligible cards.";
  }

  return null;
}
