import { useState } from "react";
import { Link } from "react-router-dom";
import { BellRing, GripVertical, MapPin } from "lucide-react";
import type { Prospect, ProspectStatus } from "../../../services/prospectApi";
import { formatShortDate, getFollowUpState, initialsOf, PRIORITY_MAP, PROSPECT_STATUSES } from "./prospectConstants";

interface ProspectKanbanProps {
  prospects: Prospect[];
  onMoveStatus: (prospect: Prospect, nextStatus: ProspectStatus) => void;
}

export default function ProspectKanban({ prospects, onMoveStatus }: ProspectKanbanProps) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overStatus, setOverStatus] = useState<ProspectStatus | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {PROSPECT_STATUSES.map((col) => {
        const items = prospects.filter((p) => p.status === col.value);
        const isOver = overStatus === col.value;

        return (
          <div
            key={col.value}
            onDragOver={(e) => {
              e.preventDefault();
              if (overStatus !== col.value) setOverStatus(col.value);
            }}
            onDragLeave={() => {
              if (overStatus === col.value) setOverStatus(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setOverStatus(null);
              if (draggingId == null) return;
              const dragged = prospects.find((p) => p.id === draggingId);
              setDraggingId(null);
              if (dragged && dragged.status !== col.value) {
                onMoveStatus(dragged, col.value);
              }
            }}
            className={`w-72 shrink-0 flex flex-col rounded-xl bg-gray-100/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 border-t-2 ${col.columnAccent} transition-colors ${
              isOver ? "ring-2 ring-amber-500/40 bg-amber-500/5" : ""
            }`}
          >
            {/* En-tête de colonne */}
            <div className="px-3.5 py-3 flex items-center justify-between border-b border-gray-200/70 dark:border-gray-800">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                {col.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {items.length}
              </span>
            </div>

            {/* Cartes de la colonne */}
            <div className="p-2.5 space-y-2.5 min-h-[220px] flex-1">
              {items.length === 0 ? (
                <div className="h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs text-gray-400">
                  Déposez un dossier ici
                </div>
              ) : (
                items.map((p) => {
                  const priority = PRIORITY_MAP[p.priority];
                  const followState = getFollowUpState(p.nextFollowUpDate, p.status);
                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => setDraggingId(p.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverStatus(null);
                      }}
                      className={`rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs hover:border-amber-500/50 transition-all cursor-grab active:cursor-grabbing ${
                        draggingId === p.id ? "opacity-50" : ""
                      }`}
                    >
                      {p.coverImage ? (
                        <Link to={`/admin/prospection/${p.id}`} className="block h-20 overflow-hidden">
                          <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover" />
                        </Link>
                      ) : (
                        <Link
                          to={`/admin/prospection/${p.id}`}
                          className="h-12 bg-gradient-to-r from-amber-500/15 to-transparent flex items-center px-3 text-xs font-black text-amber-600/60 dark:text-amber-400/50"
                        >
                          {initialsOf(p.name)}
                        </Link>
                      )}

                      <div className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1.5">
                          <Link
                            to={`/admin/prospection/${p.id}`}
                            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <GripVertical className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        </div>

                        {(p.sector || p.location) && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                            {p.sector && <span>{p.sector}</span>}
                            {p.sector && p.location && <span>·</span>}
                            {p.location && (
                              <span className="inline-flex items-center gap-0.5 truncate">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {p.location}
                              </span>
                            )}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          {priority && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priority.className}`}>
                              {priority.label}
                            </span>
                          )}
                          {p.nextFollowUpDate && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                followState === "overdue"
                                  ? "text-red-600 dark:text-red-400"
                                  : followState === "today"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {(followState === "overdue" || followState === "today") && <BellRing className="w-3 h-3" />}
                              {formatShortDate(p.nextFollowUpDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
