import type { InteractionType, ProspectPriority, ProspectStatus } from "../../../services/prospectApi";

export const PROSPECT_STATUSES: {
  value: ProspectStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  columnAccent: string;
}[] = [
  {
    value: "a_prospecter",
    label: "À prospecter",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dotClass: "bg-slate-400",
    columnAccent: "border-t-slate-400",
  },
  {
    value: "a_contacter",
    label: "À contacter",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
    dotClass: "bg-sky-500",
    columnAccent: "border-t-sky-500",
  },
  {
    value: "contacte",
    label: "Contacté",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    dotClass: "bg-indigo-500",
    columnAccent: "border-t-indigo-500",
  },
  {
    value: "en_discussion",
    label: "En discussion",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    dotClass: "bg-amber-500",
    columnAccent: "border-t-amber-500",
  },
  {
    value: "proposition_envoyee",
    label: "Proposition envoyée",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30",
    dotClass: "bg-violet-500",
    columnAccent: "border-t-violet-500",
  },
  {
    value: "en_negociation",
    label: "En négociation",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30",
    dotClass: "bg-orange-500",
    columnAccent: "border-t-orange-500",
  },
  {
    value: "gagne",
    label: "Gagné",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    dotClass: "bg-emerald-500",
    columnAccent: "border-t-emerald-500",
  },
  {
    value: "perdu",
    label: "Perdu",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    dotClass: "bg-rose-500",
    columnAccent: "border-t-rose-500",
  },
  {
    value: "en_pause",
    label: "En pause",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    dotClass: "bg-gray-400",
    columnAccent: "border-t-gray-400",
  },
];

export const STATUS_MAP = Object.fromEntries(PROSPECT_STATUSES.map((s) => [s.value, s])) as Record<
  ProspectStatus,
  (typeof PROSPECT_STATUSES)[number]
>;

export const PROSPECT_PRIORITIES: {
  value: ProspectPriority;
  label: string;
  className: string;
}[] = [
  { value: "basse", label: "Basse", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  { value: "moyenne", label: "Moyenne", className: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { value: "haute", label: "Haute", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { value: "urgente", label: "Urgente", className: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300" },
];

export const PRIORITY_MAP = Object.fromEntries(PROSPECT_PRIORITIES.map((p) => [p.value, p])) as Record<
  ProspectPriority,
  (typeof PROSPECT_PRIORITIES)[number]
>;

export const INTERACTION_TYPES: {
  value: InteractionType;
  label: string;
  badgeClass: string;
}[] = [
  { value: "email", label: "Email envoyé", badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  { value: "appel", label: "Appel téléphonique", badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { value: "rendez_vous", label: "Rendez-vous", badgeClass: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  { value: "relance", label: "Relance", badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: "proposition", label: "Proposition commerciale", badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  { value: "note", label: "Note interne", badgeClass: "bg-gray-500/15 text-gray-700 dark:text-gray-300" },
  { value: "statut", label: "Changement de statut", badgeClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300" },
];

export const INTERACTION_MAP = Object.fromEntries(INTERACTION_TYPES.map((t) => [t.value, t])) as Record<
  InteractionType,
  (typeof INTERACTION_TYPES)[number]
>;

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function getFollowUpState(
  nextDate?: string | null,
  status?: ProspectStatus
): "overdue" | "today" | "upcoming" | null {
  if (!nextDate) return null;
  if (status === "gagne" || status === "perdu" || status === "en_pause") return null;
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (nextDate < todayIso) return "overdue";
  if (nextDate === todayIso) return "today";
  return "upcoming";
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
