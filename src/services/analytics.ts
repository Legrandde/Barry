import { API_URL } from "./api";

export type TrackedEvent =
  | "pageview"
  | "whatsapp_click"
  | "email_click"
  | "contact_form_sent"
  | "phone_click"
  | "social_click"
  | "project_open";

/** Envoie une visite ou une action à l'API. Ne bloque jamais l'interface. */
export function track(name: TrackedEvent = "pageview", label?: string) {
  const path = window.location.pathname || "/";
  // Ne jamais suivre les pages d'administration ni de connexion
  if (path.startsWith("/admin") || path.startsWith("/lamougoun")) return;

  const utmSource = new URLSearchParams(window.location.search).get("utm_source") ?? undefined;
  fetch(`${API_URL}/api/public/track`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      label,
      path,
      referrer: document.referrer || undefined,
      utmSource,
    }),
  }).catch(() => {});
}

let lastTrackedPath = "";
let lastTrackedAt = 0;
const DEDUPE_MS = 2000;

/**
 * Enregistre une visite pour le chemin courant.
 * Déduplique le double montage de React StrictMode (< 2s sur le même chemin),
 * tout en suivant correctement les retours / changements de page en SPA.
 */
export function trackPageview() {
  const path = window.location.pathname || "/";
  if (path.startsWith("/admin") || path.startsWith("/lamougoun")) return;

  const now = Date.now();
  if (path === lastTrackedPath && now - lastTrackedAt < DEDUPE_MS) {
    return;
  }
  lastTrackedPath = path;
  lastTrackedAt = now;
  track("pageview");
}
