import { AnnouncementBar } from "@/components/announcement-bar";
import { HeroSection } from "@/components/hero-section";
import { ProductStore } from "@/components/product-store";
import { PromoCard } from "@/components/promo-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  featureBand,
  footerColumns,
  heroSections,
  legalLinks,
  navLinks,
  products,
  promoCards,
} from "@/lib/landing-content";

export default function Home() {
  return (
    <div className="landing-page apple-landing-page">
      <SiteHeader navLinks={navLinks} />

      <main>
        <AnnouncementBar />

        {heroSections.map((section, index) => (
          <HeroSection
            key={section.title}
            id={section.id}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            primaryCta={section.primaryCta}
            secondaryCta={section.secondaryCta}
            theme={section.theme}
            accent={section.accent}
            image={section.image}
            titleTag={index === 0 ? "h1" : "h2"}
          />
        ))}

        <section className="promo-grid" id="promos" aria-labelledby="promo-heading">
          <div className="section-heading promo-grid__heading">
            <p className="section-heading__eyebrow">Explore more</p>
            <h2 id="promo-heading">Offers, services, and support designed around your devices.</h2>
            <p>
              Explore education pricing, trade in, entertainment, accessories, and support experiences tailored to the Apple India storefront.
            </p>
          </div>
          <div className="promo-grid__cards">
            {promoCards.map((card) => (
              <PromoCard
                key={card.title}
                title={card.title}
                description={card.description}
                theme={card.theme}
                cta={card.cta}
                image={card.image}
              />
            ))}
          </div>
        </section>

        <ProductStore products={products} />

        <section className="feature-band" id="experience" aria-labelledby="feature-band-heading">
          <div>
            <p className="section-heading__eyebrow">{featureBand.eyebrow}</p>
            <h2 id="feature-band-heading">{featureBand.title}</h2>
          </div>
          <p>{featureBand.description}</p>
        </section>
      </main>

      <SiteFooter footerColumns={footerColumns} legalLinks={legalLinks} />
    </div>
  );
}
