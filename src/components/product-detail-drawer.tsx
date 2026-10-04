import Image from "next/image";
import { useEffect, useRef } from "react";

import { formatCurrency, type Product } from "@/lib/product-types";

type ProductDetailDrawerProps = {
  product: Product;
  onClose: () => void;
  onAddToBag: (product: Product) => void;
};

export function ProductDetailDrawer({ product, onClose, onAddToBag }: ProductDetailDrawerProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const panelElement = panelRef.current;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appRoot = document.getElementById("app-root");
    const selectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    if (appRoot) {
      appRoot.setAttribute("aria-hidden", "true");
      appRoot.inert = true;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelElement) {
        return;
      }

      const focusableElements = Array.from(panelElement.querySelectorAll<HTMLElement>(selectors));

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelElement.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";

      if (appRoot) {
        appRoot.removeAttribute("aria-hidden");
        appRoot.inert = false;
      }

      previousActiveElement?.focus();
    };
  }, [onClose]);

  return (
    <div className="product-drawer" role="presentation">
      <button
        type="button"
        className="product-drawer__backdrop"
        aria-label="Close product details"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        className="product-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${product.id}-details-heading`}
        tabIndex={-1}
      >
        <div className="product-drawer__header">
          <p className="section-heading__eyebrow">{product.category}</p>
          <button
            ref={closeButtonRef}
            type="button"
            className="product-drawer__close"
            aria-label="Close product details"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="product-drawer__body">
          <div className="product-drawer__media">
            <Image src={product.image.src} alt={product.image.alt} fill sizes="(max-width: 980px) 100vw, 40vw" />
          </div>
          <div className="product-drawer__content">
            <h3 id={`${product.id}-details-heading`}>{product.name}</h3>
            <p className="product-drawer__description">{product.summary ?? product.description}</p>
            <div className="product-drawer__pricing">
              <strong>{formatCurrency(product.price)}</strong>
              {product.monthlyPriceNote ? <span>{product.monthlyPriceNote}</span> : null}
            </div>
            <div className="product-drawer__meta">
              <p>
                <span>Finish</span>
                <strong>{product.finish}</strong>
              </p>
              <p>
                <span>Highlight</span>
                <strong>{product.accent}</strong>
              </p>
              {product.availability ? (
                <p>
                  <span>Availability</span>
                  <strong>{product.availability}</strong>
                </p>
              ) : null}
            </div>
            {product.specs?.length ? (
              <div className="product-drawer__specs">
                <h4>Why you&apos;ll love it</h4>
                <ul>
                  {product.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="product-drawer__actions">
              <button type="button" className="button button--primary" onClick={() => onAddToBag(product)}>
                Add to bag
              </button>
              <button type="button" className="button button--secondary" onClick={onClose}>
                Keep browsing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
