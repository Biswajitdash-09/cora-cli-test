"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { ProductDetailDrawer } from "@/components/product-detail-drawer";
import { formatCurrency, type Product } from "@/lib/product-types";

export function ProductStore({ products }: { products: readonly Product[] }) {
  const { addToCart, cartCount, cartItems, cartTotal, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [message, setMessage] = useState("Choose a category, compare the latest lineup in India, and add a product to your bag.");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.body.dataset.storefrontReady = "true";
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category))], [products]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const resultsLabel = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;
  const bagStatus =
    cartCount === 0
      ? "Your bag is empty. Add a product to review India pricing and checkout options."
      : `${cartCount} item${cartCount === 1 ? "" : "s"} ready. Subtotal ${formatCurrency(cartTotal)}.`;

  function handleAddToCart(product: Product) {
    addToCart(product);
    setMessage(`${product.name} added to your bag. Keep browsing the lineup or review your summary.`);
  }

  function buyNow(product: Product) {
    addToCart(product);
    setMessage(`${product.name} added to your bag. Review your summary below, then continue to checkout.`);
  }

  function openDetails(product: Product, trigger: HTMLButtonElement) {
    detailTriggerRef.current = trigger;
    setSelectedProduct(product);
  }

  function closeDetails() {
    setSelectedProduct(null);
    detailTriggerRef.current?.focus();
  }

  return (
    <section className="storefront" id="store" aria-labelledby="store-heading">
      <div className="section-heading storefront__heading">
        <p className="section-heading__eyebrow">Shop the latest</p>
        <h2 id="store-heading">Shop the latest lineup in India.</h2>
        <p className="storefront__summary" aria-live="polite">
          {message}
        </p>
      </div>

      <div className="storefront__toolbar" role="toolbar" aria-label="Product categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selectedCategory === category}
            className={`storefront__filter${selectedCategory === category ? " is-active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="storefront__results" aria-live="polite">
        <p>
          Showing <strong>{resultsLabel}</strong>
          {selectedCategory === "All" ? " across the full lineup." : ` in ${selectedCategory}.`}
        </p>
        <p>{bagStatus}</p>
      </div>

      <div className="storefront__layout">
        <div className="storefront__catalog-wrap">
          {visibleProducts.length === 0 ? (
            <div className="storefront__empty-state" role="status" aria-live="polite">
              <h3>No products in this category yet.</h3>
              <p>Choose another filter to compare more Apple devices and accessories.</p>
            </div>
          ) : null}
          <div className="storefront__catalog" role="list" aria-label="Product catalog">
            {visibleProducts.map((product) => (
              <article key={product.id} className="product-card" role="listitem">
                <div className="product-card__top">
                  <p className="product-card__category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className="product-card__meta">
                  <p>
                    <span>Finish</span>
                    <strong>{product.finish}</strong>
                  </p>
                  <p>
                    <span>Highlight</span>
                    <strong>{product.accent}</strong>
                  </p>
                  <p>
                    <span>From</span>
                    <strong>{formatCurrency(product.price)}</strong>
                  </p>
                </div>
                <div className="product-card__actions">
                  <button type="button" className="button button--primary" onClick={() => handleAddToCart(product)}>
                    Add to bag
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={(event) => openDetails(product, event.currentTarget)}
                  >
                    View details
                  </button>
                  <button type="button" className="button button--secondary" onClick={() => buyNow(product)}>
                    Add and review
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart-panel" aria-labelledby="cart-heading">
          <div className="cart-panel__header">
            <p className="section-heading__eyebrow">Your bag</p>
            <h3 id="cart-heading" suppressHydrationWarning>
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </h3>
            <p suppressHydrationWarning>{bagStatus}</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-panel__empty" role="status" suppressHydrationWarning>
              <p>Your bag is empty.</p>
              <p>Add a product to unlock checkout and review your order summary here.</p>
            </div>
          ) : (
            <ul className="cart-panel__list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-line-item">
                  <div>
                    <h4>{item.name}</h4>
                    <p>
                      {item.finish} · {formatCurrency(item.price)}
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

          {cartItems.length === 0 ? (
            <button
              type="button"
              className="button button--primary cart-panel__checkout"
              disabled
              aria-describedby="cart-checkout-note"
            >
              Checkout
            </button>
          ) : (
            <Link href="/checkout" className="button button--primary cart-panel__checkout" suppressHydrationWarning>
              Checkout
            </Link>
          )}

          <p className="cart-panel__checkout-note" id="cart-checkout-note">
            {cartItems.length === 0 ? "Checkout becomes available after you add at least one product." : "Ready to continue with your current bag."}
          </p>
        </aside>
      </div>

      {selectedProduct ? (
        <ProductDetailDrawer product={selectedProduct} onClose={closeDetails} onAddToBag={handleAddToCart} />
      ) : null}
    </section>
  );
}
