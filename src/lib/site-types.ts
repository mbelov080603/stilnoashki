export type NavItem = {
  label: string;
  href: string;
};

export type CtaLink = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type ContactLine = {
  label: string;
  value: string;
  href?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type City = {
  id: string;
  name: string;
  slug: string;
  region: string;
  coordinates: [number, number];
  networkX: string;
  networkY: string;
  spotlight: string;
  featured: boolean;
};

export type Store = {
  id: string;
  cityId: string;
  slug: string;
  title: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  hours: string;
  services: string[];
  categories: string[];
  featured: boolean;
};

export type ProductCategory = {
  id: string;
  slug: string;
  title: string;
  type: "nicotine" | "nicotine-free";
  shortDescription: string;
  longDescription: string;
  status: string;
  disclaimer: string;
  heroTitle: string;
  heroBody: string;
  heroImage?: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  flavor: string;
  nicotineStrength: string;
  image?: string;
  packaging?: string;
  status: string;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  nicotineType: "nicotine" | "nicotine-free";
  shortDescription: string;
  longDescription: string;
  availability: string;
  highlight: string;
  specs: Array<{ label: string; value: string }>;
  facts: string[];
  warnings: string[];
  images: string[];
  packagingImages: string[];
  variants: ProductVariant[];
  featured: boolean;
};

export type Partner = {
  id: string;
  name: string;
  type: "distribution" | "retail" | "franchise";
  note: string;
  region: string;
};

export type Vacancy = {
  id: string;
  slug: string;
  title: string;
  cityId: string;
  department: string;
  employmentType: string;
  salaryText: string;
  description: string[];
  requirements: string[];
  conditions: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  type: "device" | "packaging" | "technical-flat" | "close-up";
  media?: string;
  alt: string;
  caption: string;
};

export type FAQItem = {
  id: string;
  scope:
    | "general"
    | "stores"
    | "products"
    | "franchise"
    | "careers"
    | "responsible";
  question: string;
  answer: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  author: string;
  body: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  effectiveDate: string;
  version: string;
  summary: string;
  body: string[];
};

export type ResolvedPage = {
  kind:
    | "stores-index"
    | "city"
    | "store"
    | "about"
    | "gallery"
    | "products-index"
    | "product-category"
    | "product"
    | "partners"
    | "responsible"
    | "franchise"
    | "careers-index"
    | "vacancy"
    | "contacts"
    | "articles-index"
    | "article"
    | "faq"
    | "thank-you"
    | "legal";
  title: string;
  description: string;
  pathname: string[];
  city?: City;
  stores?: Store[];
  store?: Store;
  category?: ProductCategory;
  products?: Product[];
  product?: Product;
  vacancy?: Vacancy;
  article?: Article;
  legalPage?: LegalPage;
  thankYouType?: string;
};

export type LaunchMetric = {
  value: string;
  label: string;
  note: string;
};

export type PartnershipScenario = {
  title: string;
  body: string;
};
