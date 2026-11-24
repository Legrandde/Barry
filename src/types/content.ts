export type SectionKey =
  | "site"
  | "theme"
  | "hero"
  | "about"
  | "services"
  | "skills"
  | "stats"
  | "parcours"
  | "formation"
  | "process"
  | "projects"
  | "testimonials"
  | "contact"
  | "cta";

export interface SiteSection {
  firstName: string;
  lastName: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  footerDescription: string;
  footerTagline: string;
}

export interface ThemeSection {
  accentColor: string;
  defaultMode: "light" | "dark" | "system";
  headingFont: string;
  bodyFont: string;
}

export type HeroLayout = "classic" | "centered" | "editorial" | "poster" | "minimal";

export interface HeroSection {
  layout?: HeroLayout;
  greeting: string;
  firstName: string;
  lastName: string;
  role: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  availabilityBadge?: string;
  techLogos: string[];
}

export interface AboutSection {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceItem[];
}

export interface SkillEntry {
  name: string;
  level: number;
}

export interface SkillCategoryItem {
  id: number;
  name: string;
  icon: string;
  skills: SkillEntry[];
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface SkillsContent {
  eyebrow: string;
  title: string;
  description: string;
  categories: SkillCategoryItem[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
}

export interface StatsSection {
  eyebrow: string;
  title: string;
  items: StatItem[];
}

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface ParcoursContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  achievements: string[];
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface FormationContent {
  eyebrow: string;
  title: string;
  description: string;
  items: EducationItem[];
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessSection {
  eyebrow: string;
  title: string;
  description: string;
  steps: ProcessStepItem[];
}

export interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  images: string[];
  type: "web" | "mobile" | "desktop" | "other";
  category: string;
  technologies: string[];
  liveUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ProjectItem[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  title: string;
  description: string;
  items: TestimonialItem[];
}

export interface SocialLinkItem {
  id: number;
  label: string;
  url: string;
  icon: string;
  position: number;
  isPublished: boolean;
  updatedAt?: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  ctaLabel: string;
  socials: SocialLinkItem[];
}

export interface CtaSection {
  title: string;
  highlightWord: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  footnote: string;
}

export interface SiteContent {
  visibility: Record<string, boolean>;
  theme: ThemeSection;
  site: SiteSection;
  hero: HeroSection;
  about: AboutSection;
  services: ServicesContent;
  skills: SkillsContent;
  stats: StatsSection;
  parcours: ParcoursContent;
  formation: FormationContent;
  process: ProcessSection;
  projects: ProjectsContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  cta: CtaSection;
}
