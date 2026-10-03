import Image from "next/image";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  theme: "dark" | "light" | "soft";
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
  id: string;
  titleTag: "h1" | "h2";
};

export function HeroSection({
  eyebrow,
  title,
  description,
  accent,
  theme,
  primaryCta,
  secondaryCta,
  image,
  id,
  titleTag: TitleTag,
}: HeroSectionProps) {
  return (
    <section className={`hero hero--${theme} hero--${id}`} id={id} aria-labelledby={`${id}-heading`}>
      <div className="hero__content">
        <p className="hero__eyebrow">{eyebrow}</p>
        <TitleTag id={`${id}-heading`}>{title}</TitleTag>
        <p className="hero__description">{description}</p>
        <div className="hero__actions">
          <a className="button button--primary" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          <a className="button button--secondary" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
        <p className="hero__accent">{accent}</p>
      </div>
      <div className="hero__visual">
        <div className="hero__media-shell">
          <Image className="hero__media" src={image.src} alt={image.alt} fill priority={id === "hero-0"} sizes="(max-width: 980px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
