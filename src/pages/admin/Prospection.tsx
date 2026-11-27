import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  BellRing,
  Briefcase,
  CheckCircle2,
  Columns3,
  FileText,
  LayoutGrid,
  List,
  MessageSquare,
  Pencil,
  PhoneCall,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import {
  deleteProspect,
  getProspectStats,
  listProspects,
  updateProspect,
  type Prospect,
  type ProspectStats,
  type ProspectStatus,
} from "../../services/prospectApi";
import { useToast } from "../../contexts/toast";
import ConfirmDialog from "../../component/admin/ConfirmDialog";
import ProspectCard from "../../component/admin/prospection/ProspectCard";
import ProspectFormModal from "../../component/admin/prospection/ProspectFormModal";
import ProspectKanban from "../../component/admin/prospection/ProspectKanban";
import {
  formatShortDate,
  getFollowUpState,
  initialsOf,
  PRIORITY_MAP,
  PROSPECT_PRIORITIES,
  PROSPECT_STATUSES,
  STATUS_MAP,
} from "../../component/admin/prospection/prospectConstants";

type ViewMode = "gallery" | "list" | "kanban";
type SortMode = "updated_at" | "created_at" | "next_follow_up_date";

export default function Prospection() {
  const toast = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stats, setStats] = useState<ProspectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtres, recherche, tri, vue
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState<SortMode>("updated_at");
  const [view, setView] = useState<ViewMode>("gallery");

  // Modales
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Prospect | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Prospect | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [items, st] = await Promise.all([
        listProspects({ archived: showArchived, sort }),
        getProspectStats(),
      ]);
      setProspects(items);
      setStats(st);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les dossiers de prospection.");
    } finally {
      setLoading(false);
    }
  }, [showArchived, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    for (const p of prospects) {
      if (p.sector.trim()) set.add(p.sector.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [prospects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prospects.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (sectorFilter && p.sector !== sectorFilter) return false;
      if (priorityFilter && p.priority !== priorityFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.contactName.toLowerCase().includes(q) ||
        p.contactEmail.toLowerCase().includes(q) ||
        p.proposedService.toLowerCase().includes(q) ||
        p.nextAction.toLowerCase().includes(q)
      );
    });
  }, [prospects, search, statusFilter, sectorFilter, priorityFilter]);

  const handleQuickStatus = async (prospect: Prospect, nextStatus: ProspectStatus) => {
    if (prospect.status === nextStatus) return;
    setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, status: nextStatus } : p)));
    try {
      await updateProspect(prospect.id, { status: nextStatus });
      const st = await getProspectStats();
      setStats(st);
      toast.success(`Statut de « ${prospect.name} » mis à jour : ${STATUS_MAP[nextStatus].label}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de mise à jour du statut.");
      void load();
    }
  };

  const handleToggleArchive = async (prospect: Prospect) => {
    const nextArchived = !prospect.isArchived;
    try {
      await updateProspect(prospect.id, { isArchived: nextArchived });
      toast.success(nextArchived ? `« ${prospect.name} » archivé.` : `« ${prospect.name} » restauré.`);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de modifier l'archivage.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProspect(deleteTarget.id);
      toast.success(`Dossier « ${deleteTarget.name} » supprimé.`);
      setDeleteTarget(null);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setSectorFilter("");
    setPriorityFilter("");
  };

  const hasActiveFilters = Boolean(search || statusFilter || sectorFilter || priorityFilter);

  const selectClass =
    "px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-amber-500 cursor-pointer";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prospection commerciale</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Centralisez vos dossiers prospects, suivez vos échanges et transformez vos opportunités en contrats.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nouveau dossier
        </button>
      </div>

      {/* Bandeau de rappels de relances */}
      {stats && (stats.overdueFollowUps > 0 || stats.todayFollowUps > 0) && !showArchived && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
            <BellRing className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              {stats.overdueFollowUps > 0 && (
                <strong className="font-semibold">
                  {stats.overdueFollowUps} relance{stats.overdueFollowUps > 1 ? "s" : ""} en retard
                </strong>
              )}
              {stats.overdueFollowUps > 0 && stats.todayFollowUps > 0 && " · "}
              {stats.todayFollowUps > 0 && (
                <strong className="font-semibold">
                  {stats.todayFollowUps} relance{stats.todayFollowUps > 1 ? "s" : ""} prévue{stats.todayFollowUps > 1 ? "s" : ""} aujourd'hui
                </strong>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSort("next_follow_up_date")}
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
          >
            Trier par prochaine relance →
          </button>
        </div>
      )}

      {/* Statistiques KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[
          { label: "Total prospects", value: stats?.total ?? 0, Icon: Users, accent: "text-gray-900 dark:text-white" },
          { label: "À contacter", value: stats?.aContacter ?? 0, Icon: PhoneCall, accent: "text-sky-600 dark:text-sky-400" },
          { label: "En discussion", value: stats?.enDiscussion ?? 0, Icon: MessageSquare, accent: "text-amber-600 dark:text-amber-400" },
          { label: "Propositions envoyées", value: stats?.propositionsEnvoyees ?? 0, Icon: FileText, accent: "text-violet-600 dark:text-violet-400" },
          { label: "Contrats gagnés", value: stats?.gagnes ?? 0, Icon: CheckCircle2, accent: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ label, value, Icon, accent }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <p className={`text-2xl font-bold tabular-nums mt-1 ${accent}`}>{value}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Barre d'outils : recherche, filtres, tri, archives, vue */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Recherche instantanée */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un prospect, secteur, contact, ville..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filtres */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass} aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            {PROSPECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className={selectClass} aria-label="Filtrer par secteur">
            <option value="">Tous les secteurs</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClass} aria-label="Filtrer par priorité">
            <option value="">Toutes les priorités</option>
            {PROSPECT_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                Priorité {p.label.toLowerCase()}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className={selectClass} aria-label="Trier par">
            <option value="updated_at">Dernière activité</option>
            <option value="created_at">Date de création</option>
            <option value="next_follow_up_date">Prochaine relance</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                !showArchived
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Actifs ({stats?.total ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                showArchived
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              Archivés ({stats?.archived ?? 0})
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline ml-2 cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Sélecteur de vue : Galerie / Liste / Kanban */}
          <div className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            {[
              { id: "gallery" as const, label: "Galerie", Icon: LayoutGrid },
              { id: "list" as const, label: "Liste", Icon: List },
              { id: "kanban" as const, label: "Kanban", Icon: Columns3 },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  view === id
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          {error}
        </p>
      )}

      {/* Contenu principal */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {hasActiveFilters
              ? "Aucun prospect ne correspond à ces filtres"
              : showArchived
                ? "Aucun dossier archivé"
                : "Aucun dossier de prospection pour le moment"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {hasActiveFilters
              ? "Essayez d'élargir votre recherche ou de réinitialiser les filtres actifs."
              : "Créez votre premier dossier pour organiser vos contacts, couvertures, relances et propositions."}
          </p>
          {!showArchived && !hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Créer un dossier
            </button>
          )}
        </div>
      ) : view === "gallery" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProspectCard
              key={p.id}
              prospect={p}
              onQuickStatusChange={handleQuickStatus}
              onEdit={(item) => {
                setEditing(item);
                setFormOpen(true);
              }}
              onToggleArchive={handleToggleArchive}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : view === "kanban" ? (
        <ProspectKanban prospects={filtered} onMoveStatus={handleQuickStatus} />
      ) : (
        /* Vue Liste */
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-950/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Entreprise / Prospect</th>
                  <th className="px-4 py-3 font-semibold">Secteur &amp; Lieu</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Priorité</th>
                  <th className="px-4 py-3 font-semibold">Dernier contact</th>
                  <th className="px-4 py-3 font-semibold">Prochaine action</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((p) => {
                  const st = STATUS_MAP[p.status] ?? PROSPECT_STATUSES[0];
                  const prio = PRIORITY_MAP[p.priority];
                  const followState = getFollowUpState(p.nextFollowUpDate, p.status);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/admin/prospection/${p.id}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            {p.coverImage ? (
                              <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{initialsOf(p.name)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                              {p.name}
                            </p>
                            {p.contactName && <p className="text-xs text-gray-500 dark:text-gray-400">{p.contactName}</p>}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                        <div>{p.sector || "—"}</div>
                        {p.location && <div className="text-gray-400">{p.location}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.status}
                          onChange={(e) => void handleQuickStatus(p, e.target.value as ProspectStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${st.badgeClass}`}
                        >
                          {PROSPECT_STATUSES.map((s) => (
                            <option key={s.value} value={s.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {prio && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${prio.className}`}>
                            {prio.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {formatShortDate(p.lastContactDate)}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[200px]">
                        <p className="truncate text-gray-700 dark:text-gray-200">{p.nextAction || "—"}</p>
                        {p.nextFollowUpDate && (
                          <span
                            className={`text-[11px] font-medium ${
                              followState === "overdue"
                                ? "text-red-600 dark:text-red-400"
                                : followState === "today"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {formatShortDate(p.nextFollowUpDate)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(p);
                              setFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleToggleArchive(p)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            title={p.isArchived ? "Désarchiver" : "Archiver"}
                          >
                            {p.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale Création / Modification */}
      <ProspectFormModal
        open={formOpen}
        prospect={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={() => {
          setFormOpen(false);
          setEditing(null);
          void load();
        }}
      />

      {/* Modale Confirmation Suppression */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer ce dossier prospect ?"
        description={
          deleteTarget
            ? `Le dossier « ${deleteTarget.name} », son historique d'interactions et ses documents associés seront définitivement supprimés.`
            : undefined
        }
        confirmLabel="Supprimer définitivement"
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
