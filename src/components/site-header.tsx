"use client";

import { useEffect, useState } from "react";

type NavLink = {
  label: string;
  href: string;
};

export function SiteHeader({ navLinks }: { navLinks: readonly NavLink[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.siteHeaderReady = "true";
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <a className="site-header__brand" href="#hero-0" aria-label="Apple home">
          Apple
        </a>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="site-header__menu-button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      <div
        className={`site-header__mobile-panel${isMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
      >
        <nav className="site-header__mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
