import Image from "next/image";

type PromoCardProps = {
  title: string;
  description: string;
  theme: "dark" | "light" | "soft";
  cta: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
};

export function PromoCard({ title, description, theme, cta, image }: PromoCardProps) {
  return (
    <article className={`promo-card promo-card--${theme}`}>
      {image ? (
        <div className="promo-card__image-wrap">
          <Image className="promo-card__image" src={image.src} alt={image.alt} fill sizes="(max-width: 980px) 100vw, 30vw" />
        </div>
      ) : null}
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <a href={cta.href}>{cta.label}</a>
    </article>
  );
}
