import { useEffect, useRef, useState, type FormEvent } from "react";
import { Building2, Calendar, ImagePlus, Loader2, Plus, Trash2, Upload, User, X } from "lucide-react";
import { uploadMedia } from "../../../services/adminApi";
import {
  createProspect,
  updateProspect,
  type Prospect,
  type ProspectDetail,
  type ProspectPayload,
  type ProspectPriority,
  type ProspectSocialLink,
  type ProspectStatus,
} from "../../../services/prospectApi";
import { useToast } from "../../../contexts/toast";
import { PROSPECT_PRIORITIES, PROSPECT_STATUSES } from "./prospectConstants";

interface ProspectFormModalProps {
  open: boolean;
  prospect?: Prospect | null;
  onClose: () => void;
  onSaved: (saved: ProspectDetail) => void;
}

const EMPTY_FORM: ProspectPayload = {
  name: "",
  coverImage: "",
  logo: "",
  description: "",
  sector: "",
  location: "",
  website: "",
  socialLinks: [],
  contactName: "",
  contactRole: "",
  contactEmail: "",
  contactPhone: "",
  identifiedNeed: "",
  proposedService: "",
  estimatedBudget: "",
  priority: "moyenne",
  status: "a_prospecter",
  firstContactDate: null,
  lastContactDate: null,
  nextFollowUpDate: null,
  nextAction: "",
  notes: "",
  isArchived: false,
};

export default function ProspectFormModal({ open, prospect, onClose, onSaved }: ProspectFormModalProps) {
  const toast = useToast();
  const [form, setForm] = useState<ProspectPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (prospect) {
      setForm({
        name: prospect.name,
        coverImage: prospect.coverImage,
        logo: prospect.logo,
        description: prospect.description,
        sector: prospect.sector,
        location: prospect.location,
        website: prospect.website,
        socialLinks: prospect.socialLinks ?? [],
        contactName: prospect.contactName,
        contactRole: prospect.contactRole,
        contactEmail: prospect.contactEmail,
        contactPhone: prospect.contactPhone,
        identifiedNeed: prospect.identifiedNeed,
        proposedService: prospect.proposedService,
        estimatedBudget: prospect.estimatedBudget,
        priority: prospect.priority,
        status: prospect.status,
        firstContactDate: prospect.firstContactDate,
        lastContactDate: prospect.lastContactDate,
        nextFollowUpDate: prospect.nextFollowUpDate,
        nextAction: prospect.nextAction,
        notes: prospect.notes,
        isArchived: prospect.isArchived,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, prospect]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, saving, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

  const handleImageUpload = async (file: File | undefined, target: "coverImage" | "logo") => {
    if (!file) return;
    const setBusy = target === "coverImage" ? setUploadingCover : setUploadingLogo;
    setBusy(true);
    setError("");
    try {
      const media = await uploadMedia(file);
      setForm((prev) => ({ ...prev, [target]: media.url }));
      toast.success(target === "coverImage" ? "Image de couverture téléversée." : "Logo téléversé.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec du téléversement de l'image.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "LinkedIn", url: "" }],
    }));
  };

  const updateSocialLink = (idx: number, patch: Partial<ProspectSocialLink>) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));
  };

  const removeSocialLink = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Le nom de l'entreprise ou du prospect est obligatoire.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const cleanedSocials = form.socialLinks.filter((s) => s.label.trim() && s.url.trim());
      const payload: ProspectPayload = {
        ...form,
        name: form.name.trim(),
        socialLinks: cleanedSocials,
        firstContactDate: form.firstContactDate || null,
        lastContactDate: form.lastContactDate || null,
        nextFollowUpDate: form.nextFollowUpDate || null,
      };
      const saved = prospect ? await updateProspect(prospect.id, payload) : await createProspect(payload);
      toast.success(prospect ? "Dossier mis à jour." : "Nouveau dossier de prospection créé !");
      onSaved(saved);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Impossible d'enregistrer le dossier.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-xs p-3 sm:p-6"
      onClick={() => !saving && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {prospect ? `Modifier « ${prospect.name} »` : "Nouveau dossier de prospection"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Centralisez l'identité du prospect, son besoin commercial et vos prochaines relances.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </p>
          )}

          {/* 1. Informations générales */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
              <Building2 className="w-4 h-4 text-amber-500" />
              Informations générales
            </div>

            {/* Couverture + aperçu */}
            <div className="space-y-2">
              <label className={labelClass}>Image de couverture</label>
              <div className="relative h-36 rounded-xl overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-center group">
                {form.coverImage ? (
                  <>
                    <img src={form.coverImage} alt="Couverture" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold cursor-pointer"
                      >
                        Remplacer
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, coverImage: "" }))}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Retirer
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex flex-col items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    {uploadingCover ? <Loader2 className="w-6 h-6 animate-spin text-amber-500" /> : <ImagePlus className="w-6 h-6" />}
                    <span className="text-xs font-medium">
                      {uploadingCover ? "Téléversement..." : "Cliquez pour téléverser une image de couverture"}
                    </span>
                  </button>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleImageUpload(e.target.files?.[0], "coverImage")}
                />
              </div>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
                placeholder="Ou collez l'URL d'une image de couverture..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nom de l'entreprise ou du prospect *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex : Wave Sénégal, Studio Horizon, M. Diallo..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Secteur d'activité</label>
                <input
                  type="text"
                  value={form.sector}
                  onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
                  placeholder="Ex : Fintech, EdTech, E-commerce, Santé..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Localisation</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Ex : Dakar, Conakry, Paris, Remote..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Site web</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://entreprise.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Logo de l'entreprise (facultatif)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                    placeholder="URL du logo"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="shrink-0 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-amber-500 text-gray-600 dark:text-gray-300 cursor-pointer"
                    title="Téléverser un logo"
                  >
                    {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void handleImageUpload(e.target.files?.[0], "logo")}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Contexte sur l'entreprise, taille d'équipe, activité..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Réseaux sociaux</label>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un lien
                </button>
              </div>
              {form.socialLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateSocialLink(idx, { label: e.target.value })}
                    placeholder="LinkedIn, X, Instagram..."
                    className="w-36 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(idx, { url: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(idx)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    aria-label="Supprimer le lien"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Informations commerciales */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
              <User className="w-4 h-4 text-amber-500" />
              Informations commerciales
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom du contact principal</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                  placeholder="Prénom & Nom"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fonction du contact</label>
                <input
                  type="text"
                  value={form.contactRole}
                  onChange={(e) => setForm((p) => ({ ...p, contactRole: e.target.value }))}
                  placeholder="CEO, CTO, Responsable Marketing..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Adresse email</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="contact@entreprise.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Numéro de téléphone</label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                  placeholder="+221 77 000 00 00"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Besoin identifié</label>
                <textarea
                  rows={2}
                  value={form.identifiedNeed}
                  onChange={(e) => setForm((p) => ({ ...p, identifiedNeed: e.target.value }))}
                  placeholder="Problématique du prospect, objectifs visés, points de friction..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Service proposé</label>
                <input
                  type="text"
                  value={form.proposedService}
                  onChange={(e) => setForm((p) => ({ ...p, proposedService: e.target.value }))}
                  placeholder="Ex : Application Web Full-stack, App Mobile..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Budget estimé</label>
                <input
                  type="text"
                  value={form.estimatedBudget}
                  onChange={(e) => setForm((p) => ({ ...p, estimatedBudget: e.target.value }))}
                  placeholder="Ex : 2 500 000 FCFA / 4 000 €"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* 3. Suivi */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
              <Calendar className="w-4 h-4 text-amber-500" />
              Suivi &amp; relances
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Statut de prospection</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ProspectStatus }))}
                  className={inputClass}
                >
                  {PROSPECT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Niveau de priorité</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as ProspectPriority }))}
                  className={inputClass}
                >
                  {PROSPECT_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date du premier contact</label>
                <input
                  type="date"
                  value={form.firstContactDate ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, firstContactDate: e.target.value || null }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Date de prochaine relance</label>
                <input
                  type="date"
                  value={form.nextFollowUpDate ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, nextFollowUpDate: e.target.value || null }))}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Prochaine action prévue</label>
                <input
                  type="text"
                  value={form.nextAction}
                  onChange={(e) => setForm((p) => ({ ...p, nextAction: e.target.value }))}
                  placeholder="Ex : Envoyer le devis révisé, appel de découverte vendredi..."
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Notes complémentaires</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Informations utiles, points de vigilance, contexte..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {prospect ? "Enregistrer les modifications" : "Créer le dossier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
