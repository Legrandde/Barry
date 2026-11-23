// Affichage des localisations déduites de l'IP par le backend (code pays ISO + région).

let displayNames: Intl.DisplayNames | null | undefined;

/** Nom du pays en français à partir du code ISO (« GN » → « Guinée »). */
export function countryName(code?: string | null): string {
  if (!code) return "";
  if (displayNames === undefined) {
    try {
      displayNames = new Intl.DisplayNames(["fr"], { type: "region" });
    } catch {
      displayNames = null;
    }
  }
  try {
    return displayNames?.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/** Drapeau emoji à partir du code ISO (« GN » → 🇬🇳). */
export function countryFlag(code?: string | null): string {
  if (!code || !/^[a-z]{2}$/i.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
