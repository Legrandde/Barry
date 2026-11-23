import { API_URL } from "./api";

const TOKEN_KEY = "barry-admin-token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !(init.body instanceof URLSearchParams) && !headers.has("Content-Type")) {
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
      // ignore json parse error
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface AdminUser {
  id: number;
  username: string;
  totpEnabled: boolean;
  createdAt: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  requires_2fa?: boolean;
  challenge_token?: string | null;
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.set("username", username);
  form.set("password", password);
  const res = await request<TokenResponse>("/api/auth/login", { method: "POST", body: form });
  if (!res.requires_2fa && res.access_token) {
    setToken(res.access_token);
  }
  return res;
}

export async function verify2FA(challengeToken: string, code: string): Promise<TokenResponse> {
  const res = await request<TokenResponse>("/api/auth/verify-2fa", {
    method: "POST",
    body: JSON.stringify({ challengeToken, code }),
  });
  setToken(res.access_token);
  return res;
}

export const getMe = () => request<AdminUser>("/api/auth/me");

export const setup2FA = () => request<{ secret: string; otpauthUri: string }>("/api/auth/2fa/setup", { method: "POST" });

export const enable2FA = (code: string) =>
  request<void>("/api/auth/2fa/enable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const disable2FA = (currentPassword: string, code: string) =>
  request<void>("/api/auth/2fa/disable", {
    method: "POST",
    body: JSON.stringify({ currentPassword, code }),
  });

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<void>("/api/auth/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export async function changeUsername(currentPassword: string, newUsername: string): Promise<TokenResponse> {
  const res = await request<TokenResponse>("/api/auth/username", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newUsername }),
  });
  setToken(res.access_token);
  return res;
}

// --- Sections ---
export interface SectionSummary {
  key: string;
  isVisible: boolean;
  content: Record<string, unknown>;
  updatedAt: string;
}

export interface SectionVisibility {
  key: string;
  isVisible: boolean;
  hideable: boolean;
}

export const listSections = () => request<SectionSummary[]>("/api/admin/sections");
export const getSection = (key: string) => request<Record<string, unknown>>(`/api/admin/sections/${key}`);
export const patchSection = (key: string, changes: Record<string, unknown>) =>
  request<Record<string, unknown>>(`/api/admin/sections/${key}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
export const getSectionVisibility = (key: string) => request<SectionVisibility>(`/api/admin/sections/${key}/visibility`);
export const setSectionVisibility = (key: string, isVisible: boolean) =>
  request<SectionVisibility>(`/api/admin/sections/${key}/visibility`, {
    method: "PUT",
    body: JSON.stringify({ isVisible }),
  });

// --- Collections ---
export const listCollection = <T extends { id: number }>(collection: string) =>
  request<T[]>(`/api/admin/${collection}`);
export const createCollectionItem = <T>(collection: string, payload: Record<string, unknown>) =>
  request<T>(`/api/admin/${collection}`, { method: "POST", body: JSON.stringify(payload) });
export const updateCollectionItem = <T>(collection: string, id: number, payload: Record<string, unknown>) =>
  request<T>(`/api/admin/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteCollectionItem = (collection: string, id: number) =>
  request<void>(`/api/admin/${collection}/${id}`, { method: "DELETE" });
export const reorderCollection = <T>(collection: string, ids: number[]) =>
  request<T[]>(`/api/admin/${collection}/reorder`, { method: "PUT", body: JSON.stringify({ ids }) });

// --- Messages ---
export interface ContactMessage {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
}

export const listMessages = () => request<ContactMessage[]>("/api/admin/messages");
export const getUnreadCount = () => request<{ unread: number }>("/api/admin/messages/unread-count");
export const markMessageRead = (id: number, isRead: boolean) =>
  request<ContactMessage>(`/api/admin/messages/${id}`, { method: "PATCH", body: JSON.stringify({ isRead }) });
export const deleteMessage = (id: number) => request<void>(`/api/admin/messages/${id}`, { method: "DELETE" });

// --- Media ---
export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  status: "processing" | "ready";
  originalSize: number | null;
  url: string;
  createdAt: string;
}

export const listMedia = () => request<MediaItem[]>("/api/admin/media");
export const uploadMedia = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return request<MediaItem>("/api/admin/media", { method: "POST", body: form });
};
export const deleteMedia = (id: number) => request<void>(`/api/admin/media/${id}`, { method: "DELETE" });

// --- Analytics ---
export interface CountryStat {
  code: string;
  visitors: number;
  pageviews: number;
}

export interface RegionStat {
  country: string;
  region: string;
  visitors: number;
  pageviews: number;
}

export interface AnalyticsSummary {
  startDate: string;
  endDate: string;
  days: number;
  geoAvailable: boolean;
  totals: { pageviews: number; uniqueVisitors: number; events: number };
  today: { pageviews: number; uniqueVisitors: number; events: number };
  activeVisitors: number;
  daily: { date: string; pageviews: number; uniqueVisitors: number }[];
  topPages: { name: string; count: number }[];
  countries: CountryStat[];
  regions: RegionStat[];
  referrers: { name: string; count: number }[];
  utmSources: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
  operatingSystems: { name: string; count: number }[];
  languages: { name: string; count: number }[];
  events: { name: string; label: string | null; count: number }[];
}

export const getAnalyticsSummary = (days = 30) => request<AnalyticsSummary>(`/api/admin/analytics/summary?days=${days}`);
