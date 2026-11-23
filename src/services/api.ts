import type { SiteContent } from "../types/content";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export async function fetchSiteContent(signal?: AbortSignal): Promise<SiteContent> {
  const response = await fetch(`${API_URL}/api/public/content`, { signal });
  if (!response.ok) {
    throw new Error(`Erreur API (${response.status})`);
  }
  return response.json();
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Piège à robots : champ caché, vide pour un humain */
  website: string;
}

/** Envoie le message du formulaire de contact, lu ensuite dans l'espace admin. */
export async function sendContactMessage(payload: ContactMessagePayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Connexion impossible au serveur. Vérifiez votre réseau et réessayez.");
  }
  if (response.status === 422) {
    throw new Error("Vérifiez les champs du formulaire (nom, email valide, objet, message d'au moins 5 caractères).");
  }
  if (!response.ok) {
    throw new Error("L'envoi a échoué. Réessayez dans un instant.");
  }
}
