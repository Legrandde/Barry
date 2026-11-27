import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  BellRing,
  Briefcase,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquarePlus,
  Pencil,
  Phone,
  Save,
  Tag,
  Trash2,
  Upload,
  User,
  Wallet,
} from "lucide-react";
import {
  addProspectInteraction,
  deleteProspect,
  deleteProspectDocument,
  deleteProspectInteraction,
  getProspect,
  updateProspect,
  uploadProspectDocument,
  type InteractionType,
  type ProspectDetail,
  type ProspectDocument,
  type ProspectInteraction,
  type ProspectStatus,
} from "../../services/prospectApi";
import { useToast } from "../../contexts/toast";
import ConfirmDialog from "../../component/admin/ConfirmDialog";
import ProspectFormModal from "../../component/admin/prospection/ProspectFormModal";
import {
  formatDateTime,
  formatFileSize,
  formatShortDate,
  getFollowUpState,
  initialsOf,
  INTERACTION_MAP,
  INTERACTION_TYPES,
  PRIORITY_MAP,
  PROSPECT_STATUSES,
  STATUS_MAP,
} from "../../component/admin/prospection/prospectConstants";

export default function ProspectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const docInputRef = useRef<HTMLInputElement>(null);

  const [prospect, setProspect] = useState<ProspectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Notes personnelles (sauvegarde rapide)
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Nouvelle interaction
  const [interType, setInterType] = useState<InteractionType>("email");
  const [interTitle, setInterTitle] = useState("");
  const [interContent, setInterContent] = useState("");
  const [addingInter, setAddingInter] = useState(false);

  // Upload document
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Modales
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [docToDelete, setDocToDelete] = useState<ProspectDocument | null>(null);
  const [interToDelete, setInterToDelete] = useState<ProspectInteraction | null>(null);

  const prospectId = Number(id);

  const load = useCallback(async () => {
    if (!Number.isFinite(prospectId)) {
      setError("Identifiant de dossier invalide.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getProspect(prospectId);
      setProspect(data);
      setNotesDraft(data.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger ce dossier.");
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleStatusChange = async (nextStatus: ProspectStatus) => {
    if (!prospect || prospect.status === nextStatus) return;
    try {
      const updated = await updateProspect(prospect.id, { status: nextStatus });
      setProspect(updated);
      toast.success(`Statut mis à jour : ${STATUS_MAP[nextStatus].label}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de mise à jour.");
    }
  };

  const handleSaveNotes = async () => {
    if (!prospect) return;
    setSavingNotes(true);
    try {
      const updated = await updateProspect(prospect.id, { notes: notesDraft });
      setProspect(updated);
      toast.success("Notes enregistrées.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'enregistrer les notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAddInteraction = async (e: FormEvent) => {
    e.preventDefault();
    if (!prospect || !interTitle.trim()) return;
    setAddingInter(true);
    try {
      await addProspectInteraction(prospect.id, {
        type: interType,
        title: interTitle.trim(),
        content: interContent.trim(),
      });
      setInterTitle("");
      setInterContent("");
      toast.success("Interaction ajoutée à l'historique.");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    } finally {
      setAddingInter(false);
    }
  };

  const handleUploadDoc = async (file: File | undefined) => {
    if (!prospect || !file) return;
    setUploadingDoc(true);
    try {
      const doc = await uploadProspectDocument(prospect.id, file);
      setProspect((prev) => (prev ? { ...prev, documents: [doc, ...prev.documents] } : prev));
      toast.success(`Document « ${doc.originalName} » ajouté.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec du téléversement du document.");
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const handleDeleteDoc = async () => {
    if (!prospect || !docToDelete) return;
    try {
      await deleteProspectDocument(prospect.id, docToDelete.id);
      setProspect((prev) => (prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== docToDelete.id) } : prev));
      toast.success("Document supprimé.");
      setDocToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  const handleDeleteInteraction = async () => {
    if (!prospect || !interToDelete) return;
    try {
      await deleteProspectInteraction(prospect.id, interToDelete.id);
      setProspect((prev) =>
        prev ? { ...prev, interactions: prev.interactions.filter((i) => i.id !== interToDelete.id) } : prev
      );
      toast.success("Interaction supprimée.");
      setInterToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  const handleToggleArchive = async () => {
    if (!prospect) return;
    try {
      const updated = await updateProspect(prospect.id, { isArchived: !prospect.isArchived });
      setProspect(updated);
      toast.success(updated.isArchived ? "Dossier archivé." : "Dossier restauré.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'archivage.");
    }
  };

  const handleDeleteProspect = async () => {
    if (!prospect) return;
    setDeleting(true);
    try {
      await deleteProspect(prospect.id);
      toast.success(`Dossier « ${prospect.name} » supprimé.`);
      navigate("/admin/prospection", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-56 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
          <div className="h-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/prospection"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-amber-500"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la prospection
        </Link>
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          {error || "Dossier introuvable."}
        </p>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[prospect.status] ?? PROSPECT_STATUSES[0];
  const priorityInfo = PRIORITY_MAP[prospect.priority];
  const followUpState = getFollowUpState(prospect.nextFollowUpDate, prospect.status);
  const cardClass = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5";
  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Fil d'Ariane + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/prospection"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la prospection
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-500 text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Modifier
          </button>
          <button
            type="button"
            onClick={() => void handleToggleArchive()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-400 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {prospect.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            {prospect.isArchived ? "Désarchiver" : "Archiver"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 text-sm font-medium cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Supprimer
          </button>
        </div>
      </div>

      {/* Grande couverture + identité */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="relative h-52 sm:h-64 bg-gray-100 dark:bg-gray-800">
          {prospect.coverImage ? (
            <img src={prospect.coverImage} alt={prospect.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-gray-100 to-gray-200 dark:from-amber-500/20 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center">
              <span className="text-6xl font-black text-amber-600/35 dark:text-amber-400/30 select-none">
                {initialsOf(prospect.name)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

          {prospect.isArchived && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 text-white border border-white/15">
              Dossier archivé
            </span>
          )}
        </div>

        <div className="p-6 flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            {prospect.logo && (
              <div className="-mt-12 relative z-10 w-16 h-16 rounded-xl bg-white dark:bg-gray-900 p-2 shadow-lg border border-gray-200 dark:border-gray-700 shrink-0">
                <img src={prospect.logo} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{prospect.name}</h1>
                {priorityInfo && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityInfo.className}`}>
                    Priorité {priorityInfo.label.toLowerCase()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                {prospect.sector && (
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-500" /> {prospect.sector}
                  </span>
                )}
                {prospect.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {prospect.location}
                  </span>
                )}
                {prospect.website && (
                  <a
                    href={prospect.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> Site web <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {prospect.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed pt-1">
                  {prospect.description}
                </p>
              )}

              {prospect.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {prospect.socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors"
                    >
                      {s.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sélecteur rapide de statut */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Statut commercial
            </label>
            <select
              value={prospect.status}
              onChange={(e) => void handleStatusChange(e.target.value as ProspectStatus)}
              className={`text-sm font-semibold px-3.5 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${statusInfo.badgeClass}`}
            >
              {PROSPECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grille principale 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche (2/3) : Besoins, Notes, Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunité commerciale */}
          <div className={`${cardClass} space-y-4`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              Opportunité commerciale
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-950/60 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Service proposé</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {prospect.proposedService || "Non renseigné"}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-950/60 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-amber-500" /> Budget estimé
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {prospect.estimatedBudget || "À qualifier"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Besoin identifié</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {prospect.identifiedNeed || "Aucun besoin détaillé pour le moment."}
              </p>
            </div>
          </div>

          {/* Notes personnelles */}
          <div className={`${cardClass} space-y-3`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Notes personnelles
              </h2>
              {notesDraft !== prospect.notes && (
                <button
                  type="button"
                  onClick={() => void handleSaveNotes()}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Enregistrer
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Notez ici vos observations, objections, points clés d'entretien..."
              className={inputClass}
            />
          </div>

          {/* Historique des interactions */}
          <div className={`${cardClass} space-y-5`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-amber-500" />
              Historique des interactions ({prospect.interactions.length})
            </h2>

            {/* Formulaire d'ajout rapide */}
            <form
              onSubmit={handleAddInteraction}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  value={interType}
                  onChange={(e) => setInterType(e.target.value as InteractionType)}
                  className={inputClass}
                >
                  {INTERACTION_TYPES.filter((t) => t.value !== "statut").map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={interTitle}
                  onChange={(e) => setInterTitle(e.target.value)}
                  placeholder="Objet de l'échange (ex : Appel de découverte, Envoi devis...)"
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>
              <textarea
                rows={2}
                value={interContent}
                onChange={(e) => setInterContent(e.target.value)}
                placeholder="Résumé de l'échange, prochaines étapes convenues..."
                className={inputClass}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingInter}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                >
                  {addingInter && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Ajouter à l'historique
                </button>
              </div>
            </form>

            {/* Timeline chronologique */}
            {prospect.interactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucune interaction enregistrée.</p>
            ) : (
              <ol className="relative border-l border-gray-200 dark:border-gray-800 ml-2.5 space-y-4">
                {prospect.interactions.map((inter) => {
                  const meta = INTERACTION_MAP[inter.type];
                  return (
                    <li key={inter.id} className="pl-5 relative group">
                      <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-gray-900" />
                      <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${meta.badgeClass}`}>
                              {meta.label}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{inter.title}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-400">{formatDateTime(inter.interactionDate)}</span>
                            <button
                              type="button"
                              onClick={() => setInterToDelete(inter)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer transition-opacity"
                              title="Supprimer cette entrée"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {inter.content && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {inter.content}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* Colonne droite (1/3) : Contact, Suivi, Documents */}
        <div className="space-y-6">
          {/* Contact principal */}
          <div className={`${cardClass} space-y-3.5`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              Contact principal
            </h2>

            {prospect.contactName || prospect.contactEmail || prospect.contactPhone ? (
              <div className="space-y-2.5 text-sm">
                {prospect.contactName && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{prospect.contactName}</p>
                    {prospect.contactRole && <p className="text-xs text-gray-500 dark:text-gray-400">{prospect.contactRole}</p>}
                  </div>
                )}
                {prospect.contactEmail && (
                  <a
                    href={`mailto:${prospect.contactEmail}`}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 break-all"
                  >
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    {prospect.contactEmail}
                  </a>
                )}
                {prospect.contactPhone && (
                  <a
                    href={`tel:${prospect.contactPhone}`}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500"
                  >
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    {prospect.contactPhone}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Aucun contact renseigné.</p>
            )}
          </div>

          {/* Dates & relance */}
          <div className={`${cardClass} space-y-3`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Suivi &amp; relance
            </h2>

            <dl className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Premier contact
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white">{formatShortDate(prospect.firstContactDate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Dernier contact
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white">{formatShortDate(prospect.lastContactDate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5" /> Prochaine relance
                </dt>
                <dd
                  className={`font-semibold ${
                    followUpState === "overdue"
                      ? "text-red-600 dark:text-red-400"
                      : followUpState === "today"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-900 dark:text-white"
                  }`}
                >
                  {formatShortDate(prospect.nextFollowUpDate)}
                  {followUpState === "overdue" && " (En retard)"}
                  {followUpState === "today" && " (Aujourd'hui)"}
                </dd>
              </div>
            </dl>

            {prospect.nextAction && (
              <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Prochaine action</p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{prospect.nextAction}</p>
              </div>
            )}
          </div>

          {/* Documents associés */}
          <div className={`${cardClass} space-y-3.5`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Documents ({prospect.documents.length})
              </h2>
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                disabled={uploadingDoc}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer disabled:opacity-50"
              >
                {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Ajouter
              </button>
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.pptx,.txt,.csv,.zip,image/*"
                className="hidden"
                onChange={(e) => void handleUploadDoc(e.target.files?.[0])}
              />
            </div>

            {prospect.documents.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ajoutez vos devis PDF, propositions commerciales, cahiers des charges ou maquettes.
              </p>
            ) : (
              <ul className="space-y-2">
                {prospect.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950/60 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={doc.originalName}>
                        {doc.originalName}
                      </p>
                      <p className="text-[11px] text-gray-400">{formatFileSize(doc.size)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-gray-500 hover:text-amber-500 hover:bg-gray-200/60 dark:hover:bg-gray-800"
                        title="Ouvrir / Télécharger"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setDocToDelete(doc)}
                        className="p-1.5 rounded text-red-500 hover:bg-red-500/10 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ProspectFormModal
        open={editOpen}
        prospect={prospect}
        onClose={() => setEditOpen(false)}
        onSaved={(updated) => {
          setEditOpen(false);
          setProspect(updated);
          setNotesDraft(updated.notes);
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Supprimer ce dossier prospect ?"
        description={`Le dossier « ${prospect.name} », toutes ses interactions et ses documents seront définitivement supprimés.`}
        confirmLabel="Supprimer définitivement"
        loading={deleting}
        onConfirm={() => void handleDeleteProspect()}
        onCancel={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(docToDelete)}
        title="Supprimer ce document ?"
        description={docToDelete ? `Le fichier « ${docToDelete.originalName} » sera supprimé du serveur.` : undefined}
        onConfirm={() => void handleDeleteDoc()}
        onCancel={() => setDocToDelete(null)}
      />

      <ConfirmDialog
        open={Boolean(interToDelete)}
        title="Supprimer cette interaction ?"
        description={interToDelete ? `L'entrée « ${interToDelete.title} » sera retirée de l'historique.` : undefined}
        onConfirm={() => void handleDeleteInteraction()}
        onCancel={() => setInterToDelete(null)}
      />
    </div>
  );
}
