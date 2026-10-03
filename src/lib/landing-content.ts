import type { FooterColumn, FooterLink } from "@/components/site-footer";
import type { Product, ProductImage } from "@/lib/product-types";

type PromoCardContent = {
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

export const navLinks = [
  { label: "Store", href: "#store" },
  { label: "Mac", href: "#hero-1" },
  { label: "iPhone", href: "#hero-0" },
  { label: "Watch", href: "#hero-2" },
  { label: "Trade In", href: "#promos" },
  { label: "Experience", href: "#experience" },
] as const;

export const heroSections = [
  {
    id: "hero-0",
    eyebrow: "Apple (India)",
    title: "iPhone 16 Pro",
    description:
      "Discover the innovative world of Apple in India with titanium design, pro camera control, and everyday performance built for what matters most.",
    primaryCta: { label: "Learn more", href: "#store" },
    secondaryCta: { label: "Buy", href: "#store" },
    theme: "dark",
    accent: "Titanium. So strong. So light. So Pro.",
    image: {
      src: "/images/heroes/macbook-air.jpg",
      alt: "Official iPhone 16 Pro product image from Apple Newsroom.",
    },
  },
  {
    id: "hero-1",
    eyebrow: "Save on Mac and iPad for college",
    title: "MacBook Air",
    description:
      "Supercharged performance, all-day battery life, and a remarkably thin design — ideal for study, work, and everything in between.",
    primaryCta: { label: "Shop Mac", href: "#store" },
    secondaryCta: { label: "College offer", href: "#promos" },
    theme: "light",
    accent: "Lean. Fast. Unreasonably capable.",
    image: {
      src: "/images/heroes/macbook-air.jpg",
      alt: "Official MacBook Air product image from Apple Newsroom.",
    },
  },
  {
    id: "hero-2",
    eyebrow: "Apple Watch",
    title: "Apple Watch Series 10",
    description:
      "A larger display, refined health insights, and everyday wellness features that stay close without getting in the way.",
    primaryCta: { label: "Learn more", href: "#store" },
    secondaryCta: { label: "Buy", href: "#store" },
    theme: "soft",
    accent: "Smarter around the clock.",
    image: {
      src: "/images/heroes/apple-watch-series-10.jpg",
      alt: "Official Apple Watch Series 10 product image from Apple Newsroom.",
    },
  },
] as const;

const fallbackProductImage: ProductImage = {
  src: "/images/products/macbook-air-15.jpg",
  alt: "Official Apple product image from Apple Newsroom.",
};

export const products: readonly Product[] = [
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iPhone",
    description: "Pro camera control, titanium edges, and the advanced performance featured on Apple India.",
    price: 119900,
    accent: "A18 Pro performance",
    finish: "Desert Titanium",
    image: fallbackProductImage,
    summary:
      "Built for the moments that matter most, iPhone 16 Pro combines titanium strength, advanced camera control, and fast everyday performance in one refined design.",
    specs: [
      "6.3-inch Super Retina XDR display",
      "A18 Pro for graphics-intensive workflows and gaming",
      "Pro camera system with advanced zoom and video control",
    ],
    availability: "In stock for delivery and pickup",
    monthlyPriceNote: "From ₹9,992/mo. with eligible cards.",
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    category: "iPhone",
    description: "A vibrant everyday flagship with fast performance, Camera Control, and all-day battery life.",
    price: 79900,
    accent: "Camera Control",
    finish: "Ultramarine",
    image: fallbackProductImage,
    summary:
      "iPhone 16 brings bright finishes, fast performance, and a capable camera system together in a design made to feel effortless every day.",
    specs: [
      "6.1-inch Super Retina XDR display",
      "Fast chip performance for apps, photos, and games",
      "Long battery life with everyday camera upgrades",
    ],
    availability: "In stock online",
    monthlyPriceNote: "From ₹6,658/mo. with eligible cards.",
  },
  {
    id: "macbook-air-15",
    name: "MacBook Air 15-inch",
    category: "Mac",
    description: "Thin, silent, and ready for college, creative work, and everyday productivity with all-day battery life.",
    price: 134900,
    accent: "Built for Apple Intelligence",
    finish: "Midnight",
    image: {
      src: "/images/products/macbook-air-15.jpg",
      alt: "Official MacBook Air product image from Apple Newsroom.",
    },
    summary:
      "MacBook Air 15-inch gives you a spacious display, all-day battery life, and the kind of silent performance that disappears into your study and work routine.",
    specs: [
      "15.3-inch Liquid Retina display",
      "Fanless design for quiet performance",
      "Long battery life for classes, calls, and creative work",
    ],
    availability: "Education pricing available",
    monthlyPriceNote: "From ₹11,242/mo. with eligible cards.",
  },
  {
    id: "ipad-pro-13",
    name: "iPad Pro 13-inch",
    category: "iPad",
    description: "Ultra Retina XDR brilliance and pro performance in an incredibly thin and light design.",
    price: 129900,
    accent: "M-series performance",
    finish: "Space Black",
    image: fallbackProductImage,
    summary:
      "iPad Pro pairs a vivid Ultra Retina XDR experience with pro-level speed, making it ideal for sketching, editing, and focused productivity.",
    specs: [
      "13-inch Ultra Retina XDR display",
      "Thin and light design for travel and work",
      "Supports Apple Pencil Pro and keyboard workflows",
    ],
    availability: "In stock online",
    monthlyPriceNote: "From ₹10,825/mo. with eligible cards.",
  },
  {
    id: "watch-series-10",
    name: "Apple Watch Series 10",
    category: "Watch",
    description: "Refined health features, a larger display, and daily insights designed to stay close and useful.",
    price: 46900,
    accent: "Health and activity insights",
    finish: "Silver Aluminum",
    image: fallbackProductImage,
    summary:
      "Apple Watch Series 10 keeps the most important updates close with a larger display, activity tracking, and everyday wellness features.",
    specs: [
      "Larger always-on display",
      "Heart rate, activity, and sleep tracking",
      "Lightweight design for all-day comfort",
    ],
    availability: "Pickup available today",
    monthlyPriceNote: "From ₹3,908/mo. with eligible cards.",
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro",
    category: "Audio",
    description: "Immersive sound, active noise cancellation, and comfort that works beautifully across Apple devices.",
    price: 24900,
    accent: "Personalized Spatial Audio",
    finish: "White",
    image: fallbackProductImage,
    summary:
      "AirPods Pro combine active noise cancellation, a comfortable in-ear fit, and sound that moves naturally with your Apple devices.",
    specs: [
      "Active Noise Cancellation and Transparency mode",
      "Personalized Spatial Audio",
      "Seamless pairing across iPhone, iPad, Mac, and Watch",
    ],
    availability: "Ships in 1–2 business days",
    monthlyPriceNote: "From ₹2,075/mo. with eligible cards.",
  },
];

export const promoCards: readonly PromoCardContent[] = [
  {
    title: "Save on Mac and iPad for college",
    description: "Last chance to get AirPods with Mac and Apple Pencil with iPad through the education store offer in India.",
    theme: "dark",
    cta: { label: "Shop education", href: "#store" },
    image: {
      src: "/images/products/macbook-air-15.jpg",
      alt: "Official Apple product image from Apple Newsroom.",
    },
  },
  {
    title: "Apple Trade In",
    description: "Upgrade and save with a trade-in experience that keeps pricing clear, simple, and easy to compare.",
    theme: "light",
    cta: { label: "Get your estimate", href: "#store" },
    image: {
      src: "/images/products/macbook-air-15.jpg",
      alt: "Official Apple product image from Apple Newsroom.",
    },
  },
  {
    title: "Ways to Buy",
    description: "Get up to ₹15000 instant cashback on selected products with eligible cards, plus up to 6 months of No Cost EMI.",
    theme: "light",
    cta: { label: "See offers", href: "#experience" },
  },
  {
    title: "Apple TV+",
    description: "Award-winning series, films, and new releases, available as part of Apple’s entertainment experience in India.",
    theme: "dark",
    cta: { label: "Explore entertainment", href: "#experience" },
  },
  {
    title: "Accessories",
    description: "Shop cases, bands, charging solutions, and everyday essentials designed to fit beautifully into your setup.",
    theme: "soft",
    cta: { label: "Browse accessories", href: "#store" },
  },
  {
    title: "Support",
    description: "Get help with setup, repairs, coverage, and Genius Bar support with a clear, product-first experience.",
    theme: "light",
    cta: { label: "Get support", href: "#experience" },
  },
] as const;

export const footerColumns: readonly FooterColumn[] = [
  {
    heading: "Shop and Learn",
    links: [
      { label: "Store", href: "#store" },
      { label: "Mac", href: "#hero-1" },
      { label: "iPad", href: "#store" },
      { label: "iPhone", href: "#hero-0" },
      { label: "Watch", href: "#hero-2" },
      { label: "AirPods", href: "#store" },
    ],
  },
  {
    heading: "Apple Store",
    links: [
      { label: "Find a Store", href: "#footer" },
      { label: "Order Status", href: "#footer" },
      { label: "Ways to Buy", href: "#experience" },
      { label: "Personal Setup", href: "#experience" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Manage Your Apple Account", href: "#footer" },
      { label: "Apple Store Account", href: "#footer" },
      { label: "Saved Items", href: "#footer" },
      { label: "Support", href: "#experience" },
    ],
  },
  {
    heading: "About Apple",
    links: [
      { label: "Newsroom", href: "#feature-band-heading" },
      { label: "Career Opportunities", href: "#feature-band-heading" },
      { label: "Investors", href: "#feature-band-heading" },
      { label: "Contact Apple", href: "#footer" },
    ],
  },
] as const;

export const legalLinks: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "#footer" },
  { label: "Terms of Use", href: "#footer" },
  { label: "Sales Policy", href: "#footer" },
  { label: "Legal", href: "#footer" },
] as const;

export const featureBand = {
  eyebrow: "Apple (India)",
  title: "Devices, entertainment, support, and ways to buy — all in one calm experience.",
  description:
    "Explore Apple Music, Apple TV+, Apple Trade In, support, education pricing, instant cashback offers, and personal setup with a storefront designed to stay simple, clear, and premium.",
} as const;
