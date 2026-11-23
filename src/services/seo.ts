import type { SiteContent } from "../types/content";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function absoluteUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${clean}`;
}

/** Met à jour les balises SEO (title, meta, Open Graph, Twitter, canonical, JSON-LD) depuis le CMS. */
export function applySeo(content: SiteContent) {
  const fullName = `${content.site.firstName} ${content.site.lastName}`.trim();
  const title = content.site.tagline ? `${fullName} — ${content.site.tagline}` : fullName;
  const description = content.hero.description || content.site.footerDescription;
  const ogImage = absoluteUrl(content.about.image || "/barry.jpeg");
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "author", fullName);
  setMeta("name", "robots", "index, follow");
  if (content.theme?.accentColor) {
    setMeta("name", "theme-color", content.theme.accentColor);
  }

  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonicalUrl);
  if (ogImage) setMeta("property", "og:image", ogImage);

  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  if (ogImage) setMeta("name", "twitter:image", ogImage);

  setCanonical(canonicalUrl);

  // Mise à jour du JSON-LD Person
  const ldEl = document.getElementById("jsonld-person");
  if (ldEl) {
    const sameAs = content.contact.socials
      .map((s) => s.url)
      .filter((u) => /^https?:\/\//i.test(u));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: fullName,
      jobTitle: content.site.tagline || content.hero.role,
      description,
      url: window.location.origin,
      image: ogImage,
      email: content.site.email ? `mailto:${content.site.email}` : undefined,
      telephone: content.site.phone || undefined,
      address: content.site.location
        ? { "@type": "PostalAddress", addressLocality: content.site.location }
        : undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    };
    ldEl.textContent = JSON.stringify(jsonLd);
  }
}

/** Empêche l'indexation des pages d'administration. */
export function applyAdminSeo() {
  document.title = "Administration — Alhassane Barry";
  setMeta("name", "robots", "noindex, nofollow");
}
