import { API_URL } from "./api";
import { ApiError, getToken } from "./adminApi";

export type ProspectStatus =
  | "a_prospecter"
  | "a_contacter"
  | "contacte"
  | "en_discussion"
  | "proposition_envoyee"
  | "en_negociation"
  | "gagne"
  | "perdu"
  | "en_pause";

export type ProspectPriority = "basse" | "moyenne" | "haute" | "urgente";

export type InteractionType = "email" | "appel" | "rendez_vous" | "relance" | "proposition" | "note" | "statut";

export interface ProspectSocialLink {
  label: string;
  url: string;
}

export interface Prospect {
  id: number;
  name: string;
  coverImage: string;
  logo: string;
  description: string;
  sector: string;
  location: string;
  website: string;
  socialLinks: ProspectSocialLink[];
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  identifiedNeed: string;
  proposedService: string;
  estimatedBudget: string;
  priority: ProspectPriority;
  status: ProspectStatus;
  firstContactDate: string | null;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  nextAction: string;
  notes: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProspectInteraction {
  id: number;
  prospectId: number;
  type: InteractionType;
  title: string;
  content: string;
  interactionDate: string;
  createdAt: string;
}

export interface ProspectDocument {
  id: number;
  prospectId: number;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface ProspectDetail extends Prospect {
  interactions: ProspectInteraction[];
  documents: ProspectDocument[];
}

export interface ProspectStats {
  total: number;
  aContacter: number;
  enDiscussion: number;
  propositionsEnvoyees: number;
  gagnes: number;
  archived: number;
  overdueFollowUps: number;
  todayFollowUps: number;
}

export type ProspectPayload = Omit<Prospect, "id" | "createdAt" | "updatedAt">;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = `Erreur HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail)) detail = body.detail.map((e: { msg?: string }) => e.msg).join(", ");
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface ProspectListParams {
  search?: string;
  status?: string;
  sector?: string;
  priority?: string;
  archived?: boolean;
  sort?: "updated_at" | "created_at" | "next_follow_up_date";
}

export const listProspects = (params: ProspectListParams = {}) => {
  const qs = new URLSearchParams();
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.status) qs.set("status", params.status);
  if (params.sector) qs.set("sector", params.sector);
  if (params.priority) qs.set("priority", params.priority);
  if (params.archived !== undefined) qs.set("archived", String(params.archived));
  if (params.sort) qs.set("sort", params.sort);
  const query = qs.toString();
  return request<Prospect[]>(`/api/admin/prospects${query ? `?${query}` : ""}`);
};

export const getProspectStats = () => request<ProspectStats>("/api/admin/prospects/stats");

export const getProspect = (id: number) => request<ProspectDetail>(`/api/admin/prospects/${id}`);

export const createProspect = (payload: Partial<ProspectPayload> & { name: string }) =>
  request<ProspectDetail>("/api/admin/prospects", { method: "POST", body: JSON.stringify(payload) });

export const updateProspect = (id: number, payload: Partial<ProspectPayload>) =>
  request<ProspectDetail>(`/api/admin/prospects/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteProspect = (id: number) => request<void>(`/api/admin/prospects/${id}`, { method: "DELETE" });

export const addProspectInteraction = (
  prospectId: number,
  payload: { type: InteractionType; title: string; content?: string; interactionDate?: string }
) =>
  request<ProspectInteraction>(`/api/admin/prospects/${prospectId}/interactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteProspectInteraction = (prospectId: number, interactionId: number) =>
  request<void>(`/api/admin/prospects/${prospectId}/interactions/${interactionId}`, { method: "DELETE" });

export const uploadProspectDocument = (prospectId: number, file: File) => {
  const form = new FormData();
  form.append("file", file);
  return request<ProspectDocument>(`/api/admin/prospects/${prospectId}/documents`, { method: "POST", body: form });
};

export const deleteProspectDocument = (prospectId: number, docId: number) =>
  request<void>(`/api/admin/prospects/${prospectId}/documents/${docId}`, { method: "DELETE" });
