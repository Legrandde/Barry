import type { ThemeSection } from "../types/content";

const GOOGLE_FONTS: Record<string, string> = {
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700;800",
  Inter: "Inter:wght@400;500;600;700;800",
  Poppins: "Poppins:wght@400;500;600;700;800",
  Montserrat: "Montserrat:wght@400;500;600;700;800",
  "DM Sans": "DM+Sans:wght@400;500;700",
  "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;600;700;800",
  "Playfair Display": "Playfair+Display:wght@500;700;800",
  Lora: "Lora:wght@400;500;600;700",
  Manrope: "Manrope:wght@400;500;600;700",
  Lato: "Lato:wght@400;700",
  "Open Sans": "Open+Sans:wght@400;600;700",
  Nunito: "Nunito:wght@400;600;700",
};

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function shiftHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = clamp(parseInt(clean.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(clean.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(clean.slice(4, 6), 16) + amount);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function ensureGoogleFont(fontName: string) {
  const spec = GOOGLE_FONTS[fontName];
  if (!spec) return;
  const id = `gf-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
}

export function fontStack(fontName: string): string {
  if (!fontName || fontName === "system-sans") {
    return "ui-sans-serif, system-ui, -apple-system, sans-serif";
  }
  return `'${fontName}', 'Satoshi', ui-sans-serif, system-ui, sans-serif`;
}

/** Applique la charte graphique définie dans le CMS (couleur principale, polices, mode par défaut). */
export function applyTheme(theme?: ThemeSection | null) {
  if (!theme) return;
  const root = document.documentElement;

  if (/^#[0-9a-fA-F]{6}$/.test(theme.accentColor)) {
    root.style.setProperty("--color-amber-500", theme.accentColor);
    root.style.setProperty("--color-amber-400", shiftHex(theme.accentColor, 26));
    root.style.setProperty("--color-amber-600", shiftHex(theme.accentColor, -26));
  }

  if (theme.headingFont) {
    ensureGoogleFont(theme.headingFont);
    root.style.setProperty("--font-heading", fontStack(theme.headingFont));
  }

  if (theme.bodyFont) {
    ensureGoogleFont(theme.bodyFont);
    root.style.setProperty("--font-body", fontStack(theme.bodyFont));
  }

  // Applique le mode par défaut uniquement si le visiteur n'a pas encore choisi manuellement
  try {
    if (!localStorage.getItem("theme")) {
      const dark =
        theme.defaultMode === "dark" ||
        (theme.defaultMode === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    }
  } catch {
    // ignore storage errors
  }
}
