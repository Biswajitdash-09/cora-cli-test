export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  heading: string;
  links: readonly FooterLink[];
};

export function SiteFooter({
  footerColumns,
  legalLinks,
}: {
  footerColumns: readonly FooterColumn[];
  legalLinks: readonly FooterLink[];
}) {
  return (
    <footer className="footer" id="footer">
      <p className="footer__intro">Shop Apple devices, entertainment, accessories, and support in India through one calm, product-first experience.</p>
      <div className="footer__grid">
        {footerColumns.map((column) => (
          <div key={column.heading}>
            <h3>{column.heading}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__legal">
        <div>
          <p>Copyright © 2026 Apple Inc. All rights reserved.</p>
          <p className="footer__fine-print">Concept storefront inspired by the Apple India browsing and shopping experience.</p>
        </div>
        <div>
          {legalLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
