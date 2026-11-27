import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  BellRing,
  CalendarClock,
  Clock,
  MapPin,
  MoreHorizontal,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import type { Prospect, ProspectStatus } from "../../../services/prospectApi";
import {
  formatShortDate,
  getFollowUpState,
  initialsOf,
  PRIORITY_MAP,
  PROSPECT_STATUSES,
  STATUS_MAP,
} from "./prospectConstants";

interface ProspectCardProps {
  prospect: Prospect;
  onQuickStatusChange: (prospect: Prospect, status: ProspectStatus) => void;
  onEdit: (prospect: Prospect) => void;
  onToggleArchive: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
}

export default function ProspectCard({
  prospect,
  onQuickStatusChange,
  onEdit,
  onToggleArchive,
  onDelete,
}: ProspectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusInfo = STATUS_MAP[prospect.status] ?? PROSPECT_STATUSES[0];
  const priorityInfo = PRIORITY_MAP[prospect.priority];
  const followUpState = getFollowUpState(prospect.nextFollowUpDate, prospect.status);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-500/40 transition-all duration-200">
      {/* Image de couverture cliquable */}
      <Link to={`/admin/prospection/${prospect.id}`} className="relative block h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {prospect.coverImage ? (
          <img
            src={prospect.coverImage}
            alt={prospect.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500/15 via-gray-100 to-gray-200/80 dark:from-amber-500/20 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-amber-600/50 dark:text-amber-400/40 select-none">
              {initialsOf(prospect.name)}
            </span>
          </div>
        )}

        {/* Voile subtil pour lisibilité des badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

        {/* Logo entreprise (si renseigné) */}
        {prospect.logo && (
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-white dark:bg-gray-900 p-1 shadow-md border border-gray-200/80 dark:border-gray-700 overflow-hidden">
            <img src={prospect.logo} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Priorité en haut à gauche */}
        {priorityInfo && (
          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-xs ${priorityInfo.className}`}>
            Priorité {priorityInfo.label.toLowerCase()}
          </span>
        )}
      </Link>

      {/* Menu d'actions en haut à droite */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-900/85 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/70 dark:border-gray-700 cursor-pointer"
          aria-label="Actions du dossier"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl py-1 z-20 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(prospect);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleArchive(prospect);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                {prospect.isArchived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                {prospect.isArchived ? "Désarchiver" : "Archiver"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(prospect);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      {/* Corps de la carte */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/admin/prospection/${prospect.id}`}
              className="text-base font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
            >
              {prospect.name}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {prospect.sector && (
              <span className="inline-flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500/80" />
                {prospect.sector}
              </span>
            )}
            {prospect.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {prospect.location}
              </span>
            )}
          </div>

          {/* Sélecteur rapide de statut */}
          <div className="pt-1">
            <select
              value={prospect.status}
              onChange={(e) => onQuickStatusChange(prospect, e.target.value as ProspectStatus)}
              aria-label="Statut de prospection"
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${statusInfo.badgeClass}`}
            >
              {PROSPECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pied de carte : dernier contact & prochaine action / relance */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Dernier contact
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{formatShortDate(prospect.lastContactDate)}</span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 shrink-0">
              {followUpState === "overdue" || followUpState === "today" ? (
                <BellRing className={`w-3.5 h-3.5 ${followUpState === "overdue" ? "text-red-500" : "text-amber-500"}`} />
              ) : (
                <CalendarClock className="w-3.5 h-3.5" />
              )}
              Prochaine action
            </span>
            <span
              className={`text-right line-clamp-1 font-medium ${
                followUpState === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : followUpState === "today"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300"
              }`}
              title={prospect.nextAction || formatShortDate(prospect.nextFollowUpDate)}
            >
              {prospect.nextAction || (prospect.nextFollowUpDate ? formatShortDate(prospect.nextFollowUpDate) : "Aucune")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
