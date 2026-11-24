import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Check, Eye, EyeOff, GripVertical, Monitor, Moon, Palette, Plus, Save, Sun, Trash2, Type } from "lucide-react";
import {
  getSection,
  getSectionVisibility,
  patchSection,
  setSectionVisibility,
  type SectionVisibility,
} from "../../services/adminApi";
import { CONTENT_CACHE_KEY } from "../../contexts/ContentContext";
import { useToast } from "../../contexts/toast";
import { applyTheme, ensureGoogleFont, fontStack } from "../../services/theme";
import type { HeroLayout, ThemeSection } from "../../types/content";

const HERO_LAYOUT_OPTIONS: { value: HeroLayout; title: string; subtitle: string }[] = [
  { value: "classic", title: "Classique", subtitle: "Texte à gauche, portrait & logos flottants à droite" },
  { value: "centered", title: "Centré + Cartes", subtitle: "Titre centré, portrait & cartes clés flottantes" },
  { value: "editorial", title: "Éditorial 3 colonnes", subtitle: "Nom à gauche, carte portrait centrale, rôle & stats à droite" },
  { value: "poster", title: "Affiche Portfolio", subtitle: "Typographie géante PORTFOLIO derrière et devant le portrait" },
  { value: "minimal", title: "Minimaliste", subtitle: "Titre éditorial centré très épuré au-dessus du portrait" },
];

const ACCENT_PRESETS = [
  { name: "Ambre", hex: "#f59e0b" },
  { name: "Or", hex: "#d97706" },
  { name: "Émeraude", hex: "#10b981" },
  { name: "Bleu", hex: "#2563eb" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Corail", hex: "#f43f5e" },
  { name: "Ardoise", hex: "#334155" },
];

const HEADING_FONTS = [
  "Satoshi",
  "Plus Jakarta Sans",
  "Inter",
  "Poppins",
  "Montserrat",
  "DM Sans",
  "Bricolage Grotesque",
  "Playfair Display",
  "Lora",
  "system-sans",
];

const BODY_FONTS = [
  "Satoshi",
  "Plus Jakarta Sans",
  "Inter",
  "DM Sans",
  "Manrope",
  "Poppins",
  "Lato",
  "Open Sans",
  "Nunito",
  "system-sans",
];

function BannerWireframe({ layout }: { layout: HeroLayout }) {
  if (layout === "centered") {
    return (
      <div className="h-16 rounded-md bg-gray-100 dark:bg-gray-800/80 p-2 flex flex-col items-center justify-between overflow-hidden">
        <div className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-1.5 rounded bg-gray-800 dark:bg-gray-200" />
          <div className="w-10 h-1 rounded bg-amber-500" />
        </div>
        <div className="relative flex items-end justify-center w-full">
          <div className="w-7 h-7 rounded-t-lg bg-amber-500/35 border border-amber-500/50" />
          <div className="absolute left-2 bottom-2 w-6 h-2.5 rounded bg-white dark:bg-gray-700 shadow-xs" />
          <div className="absolute right-2 bottom-1 w-6 h-2.5 rounded bg-white dark:bg-gray-700 shadow-xs" />
        </div>
      </div>
    );
  }
  if (layout === "editorial") {
    return (
      <div className="h-16 rounded-md bg-gray-100 dark:bg-gray-800/80 p-2 grid grid-cols-3 gap-1.5 items-center">
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded bg-gray-800 dark:bg-gray-200" />
          <div className="w-4/5 h-1.5 rounded bg-amber-500" />
          <div className="w-8 h-2 rounded-full bg-amber-500/80 mt-1" />
        </div>
        <div className="h-12 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex flex-col items-center justify-end p-1">
          <div className="w-6 h-6 rounded bg-amber-500/30 mb-1" />
          <div className="w-6 h-1 rounded-full bg-emerald-500" />
        </div>
        <div className="space-y-1 pl-1 border-l border-amber-500/50">
          <div className="w-full h-1.5 rounded bg-gray-700 dark:bg-gray-300" />
          <div className="w-2/3 h-1 rounded bg-gray-400" />
          <div className="w-5 h-2 rounded bg-amber-500/30 mt-1" />
        </div>
      </div>
    );
  }
  if (layout === "poster") {
    return (
      <div className="h-16 rounded-md bg-gray-950 p-2 flex flex-col justify-between overflow-hidden relative">
        <div className="flex justify-between">
          <div className="w-8 h-1 rounded bg-gray-500" />
          <div className="w-4 h-1 rounded bg-amber-400" />
        </div>
        <div className="flex items-center justify-center relative">
          <span className="text-[11px] font-black tracking-tighter text-amber-400/90 leading-none">PORTFOLIO</span>
          <div className="absolute w-5 h-7 rounded-t-full bg-gray-600/80 border border-white/20" />
        </div>
        <div className="flex justify-between">
          <div className="w-8 h-1 rounded bg-gray-400" />
          <div className="w-6 h-1.5 rounded-full bg-amber-500" />
        </div>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div className="h-16 rounded-md bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 p-2 flex flex-col items-center justify-between">
        <div className="w-full flex justify-between opacity-50">
          <div className="w-4 h-0.5 bg-gray-500" />
          <div className="w-4 h-0.5 bg-gray-500" />
          <div className="w-4 h-0.5 bg-gray-500" />
        </div>
        <div className="text-center space-y-1">
          <div className="w-16 h-2 rounded bg-gray-900 dark:bg-white mx-auto" />
          <div className="w-12 h-1 rounded bg-gray-400 mx-auto" />
        </div>
        <div className="w-7 h-4 rounded-t-full bg-amber-500/35 border-t border-x border-amber-500/50" />
      </div>
    );
  }
  return (
    <div className="h-16 rounded-md bg-gray-100 dark:bg-gray-800/80 p-2 grid grid-cols-2 gap-2 items-center">
      <div className="space-y-1">
        <div className="w-8 h-2 rounded bg-amber-500" />
        <div className="w-full h-1.5 rounded bg-gray-800 dark:bg-gray-200" />
        <div className="w-4/5 h-1 rounded bg-gray-400" />
      </div>
      <div className="relative h-11 rounded bg-amber-400/30 border border-amber-500/40 flex items-center justify-center">
        <div className="w-5 h-7 rounded-t bg-amber-500/60" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded bg-white dark:bg-gray-700 shadow" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded bg-white dark:bg-gray-700 shadow" />
      </div>
    </div>
  );
}

export default function SectionEditor() {
  const { key = "site" } = useParams();
  const toast = useToast();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dragState, setDragState] = useState<{ field: string; index: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ field: string; index: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    setNotice("");
    setError("");
    Promise.all([getSection(key), getSectionVisibility(key)])
      .then(([content, vis]) => {
        if (key === "hero") {
          setData({
            layout: "classic",
            availabilityBadge: "Disponible pour nouveaux projets",
            ...content,
          });
        } else {
          setData(content);
        }
        setVisibility(vis);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."))
      .finally(() => setLoading(false));
  }, [key]);

  // Charge les Google Fonts choisies pour l'aperçu en direct du thème
  useEffect(() => {
    if (key !== "theme" || !data) return;
    if (typeof data.headingFont === "string") ensureGoogleFont(data.headingFont);
    if (typeof data.bodyFont === "string") ensureGoogleFont(data.bodyFont);
  }, [key, data]);

  const handleToggleVisibility = async () => {
    if (!visibility || !visibility.hideable) return;
    setError("");
    try {
      const updated = await setSectionVisibility(key, !visibility.isVisible);
      setVisibility(updated);
      try {
        localStorage.removeItem(CONTENT_CACHE_KEY);
      } catch {
        /* ignore */
      }
      const msg = updated.isVisible ? "Section affichée sur le site." : "Section masquée sur le site.";
      setNotice(msg);
      toast.success(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de visibilité.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const updated = await patchSection(key, data);
      setData(updated);
      if (key === "theme") {
        applyTheme(updated as unknown as ThemeSection);
      }
      try {
        localStorage.removeItem(CONTENT_CACHE_KEY);
      } catch {
        /* ignore */
      }
      setNotice("Modifications enregistrées !");
      toast.success("Modifications enregistrées !");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const reorderArrayField = (field: string, from: number, to: number) => {
    if (!data || from === to) return;
    const current = data[field];
    if (!Array.isArray(current)) return;
    const next = [...current];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateField(field, next);
  };

  const inputClass =
    "w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Chargement de la section « {key} »...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
            {key === "theme" ? "Charte graphique & Polices" : key === "hero" ? "Bannière (Hero)" : `Section : ${key}`}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {key === "theme"
              ? "Personnalisez la couleur principale, les polices de titres et de texte, ainsi que le mode par défaut."
              : key === "hero"
                ? "Choisissez le style de bannière et personnalisez les textes, le portrait et le badge de disponibilité."
                : "Modifiez les textes, images, réglages ou glissez-déposez les éléments de liste."}
          </p>
        </div>

        {visibility && visibility.hideable && (
          <button
            type="button"
            onClick={handleToggleVisibility}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
              visibility.isVisible
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700"
            }`}
          >
            {visibility.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {visibility.isVisible ? "Visible sur le site" : "Masquée sur le site"}
          </button>
        )}
      </div>

      {notice && <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">{notice}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      {/* ── ÉDITEUR DÉDIÉ : THÈME (Couleur + Polices + Mode + Aperçu en direct) ── */}
      {data && key === "theme" && (
        <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {/* Couleur principale */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Palette className="w-4 h-4 text-amber-500" />
              Couleur principale du site
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_PRESETS.map((preset) => {
                const active = String(data.accentColor ?? "").toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateField("accentColor", preset.hex)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      active
                        ? "border-gray-900 dark:border-white bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/15" style={{ backgroundColor: preset.hex }} />
                    {preset.name}
                    {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="color"
                value={String(data.accentColor ?? "#f59e0b")}
                onChange={(e) => updateField("accentColor", e.target.value)}
                className="h-10 w-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-pointer"
                aria-label="Sélecteur de couleur"
              />
              <input
                type="text"
                value={String(data.accentColor ?? "#f59e0b")}
                onChange={(e) => updateField("accentColor", e.target.value)}
                placeholder="#f59e0b"
                className="w-36 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Code hexadécimal libre ou palette rapide</span>
            </div>
          </div>

          {/* Polices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                <Type className="w-4 h-4 text-amber-500" />
                Police des titres
              </label>
              <select
                value={String(data.headingFont ?? "Satoshi")}
                onChange={(e) => updateField("headingFont", e.target.value)}
                className={inputClass}
              >
                {HEADING_FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font === "system-sans" ? "Système (par défaut OS)" : font}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                <Type className="w-4 h-4 text-amber-500" />
                Police du texte
              </label>
              <select
                value={String(data.bodyFont ?? "Satoshi")}
                onChange={(e) => updateField("bodyFont", e.target.value)}
                className={inputClass}
              >
                {BODY_FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font === "system-sans" ? "Système (par défaut OS)" : font}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode par défaut */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              Mode d'affichage par défaut
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              {[
                { value: "light", label: "Clair", Icon: Sun },
                { value: "dark", label: "Sombre", Icon: Moon },
                { value: "system", label: "Système", Icon: Monitor },
              ].map(({ value, label, Icon }) => {
                const active = data.defaultMode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField("defaultMode", value)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                      active
                        ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aperçu en direct */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aperçu en direct</p>
            <div
              className="space-y-2"
              style={{ fontFamily: fontStack(String(data.bodyFont ?? "Satoshi")) }}
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: String(data.accentColor ?? "#f59e0b") }}
              >
                Disponible pour nouveaux projets
              </span>
              <h3
                className="text-2xl font-black text-gray-900 dark:text-white"
                style={{ fontFamily: fontStack(String(data.headingFont ?? "Satoshi")) }}
              >
                Alhassane <span style={{ color: String(data.accentColor ?? "#f59e0b") }}>Barry</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Développeur Full-Stack Web &amp; Mobile — conception d'applications rapides, modernes et durables.
              </p>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Appliquer la charte graphique"}
            </button>
          </div>
        </form>
      )}

      {/* ── ÉDITEUR GÉNÉRIQUE + SÉLECTEUR DE BANNIÈRE POUR HERO ── */}
      {data && key !== "theme" && (
        <form onSubmit={handleSave} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {Object.entries(data).map(([field, value]) => {
            if (key === "hero" && field === "layout") {
              const currentLayout = (typeof value === "string" ? value : "classic") as HeroLayout;
              return (
                <div key={field} className="space-y-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Style de bannière
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {HERO_LAYOUT_OPTIONS.map((opt) => {
                      const selected = currentLayout === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("layout", opt.value)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            selected
                              ? "border-amber-500 ring-2 ring-amber-500/25 bg-amber-500/5"
                              : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                          }`}
                        >
                          <BannerWireframe layout={opt.value} />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.title}</span>
                            {selected && (
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{opt.subtitle}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (typeof value === "boolean") {
              return (
                <label key={field} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateField(field, e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{field}</span>
                </label>
              );
            }

            if (Array.isArray(value)) {
              const isStringArray = value.every((v) => typeof v === "string");

              if (isStringArray) {
                const items = value as string[];
                return (
                  <div key={field} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field} <span className="text-xs text-gray-500">(glisser-déposer pour réordonner)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField(field, [...items, ""])}
                        className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                      </button>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => setDragState({ field, index: idx })}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragOver?.field !== field || dragOver.index !== idx) {
                              setDragOver({ field, index: idx });
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragState && dragState.field === field) {
                              reorderArrayField(field, dragState.index, idx);
                            }
                            setDragState(null);
                            setDragOver(null);
                          }}
                          onDragEnd={() => {
                            setDragState(null);
                            setDragOver(null);
                          }}
                          className={`flex items-start gap-2 p-2 rounded-lg border transition-all ${
                            dragState?.field === field && dragState.index === idx
                              ? "opacity-50 border-amber-500"
                              : dragOver?.field === field && dragOver.index === idx
                                ? "border-amber-500 bg-amber-500/5"
                                : "border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          <GripVertical className="w-4 h-4 mt-2.5 text-gray-400 shrink-0 cursor-grab" />
                          {item.length > 70 || field === "paragraphs" ? (
                            <textarea
                              rows={3}
                              value={item}
                              onChange={(e) => {
                                const next = [...items];
                                next[idx] = e.target.value;
                                updateField(field, next);
                              }}
                              className={inputClass}
                            />
                          ) : (
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const next = [...items];
                                next[idx] = e.target.value;
                                updateField(field, next);
                              }}
                              className={inputClass}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => updateField(field, items.filter((_, i) => i !== idx))}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Liste d'objets (ex: stats.items, process.steps) — draggable !
              const objItems = value as Record<string, unknown>[];
              return (
                <div key={field} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field} <span className="text-xs text-gray-500">(glisser-déposer pour réordonner)</span>
                    </label>
                    {objItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const template = Object.fromEntries(
                            Object.entries(objItems[0]).map(([k, v]) => [k, typeof v === "number" ? 0 : ""])
                          );
                          updateField(field, [...objItems, template]);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {objItems.map((obj, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => setDragState({ field, index: idx })}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOver?.field !== field || dragOver.index !== idx) {
                            setDragOver({ field, index: idx });
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragState && dragState.field === field) {
                            reorderArrayField(field, dragState.index, idx);
                          }
                          setDragState(null);
                          setDragOver(null);
                        }}
                        onDragEnd={() => {
                          setDragState(null);
                          setDragOver(null);
                        }}
                        className={`p-3.5 rounded-xl border space-y-2.5 transition-all bg-gray-50/60 dark:bg-gray-950/40 ${
                          dragState?.field === field && dragState.index === idx
                            ? "opacity-50 border-amber-500"
                            : dragOver?.field === field && dragOver.index === idx
                              ? "border-amber-500 ring-2 ring-amber-500/20"
                              : "border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-grab">
                            <GripVertical className="w-4 h-4" /> Élément #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateField(field, objItems.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {Object.entries(obj).map(([subKey, subVal]) => (
                            <div key={subKey} className={subKey === "description" ? "sm:col-span-2" : ""}>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{subKey}</label>
                              {typeof subVal === "number" ? (
                                <input
                                  type="number"
                                  value={subVal}
                                  onChange={(e) => {
                                    const next = [...objItems];
                                    next[idx] = { ...obj, [subKey]: Number(e.target.value) };
                                    updateField(field, next);
                                  }}
                                  className={inputClass}
                                />
                              ) : subKey === "description" ? (
                                <textarea
                                  rows={2}
                                  value={String(subVal ?? "")}
                                  onChange={(e) => {
                                    const next = [...objItems];
                                    next[idx] = { ...obj, [subKey]: e.target.value };
                                    updateField(field, next);
                                  }}
                                  className={inputClass}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={String(subVal ?? "")}
                                  onChange={(e) => {
                                    const next = [...objItems];
                                    next[idx] = { ...obj, [subKey]: e.target.value };
                                    updateField(field, next);
                                  }}
                                  className={inputClass}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (typeof value === "object" && value !== null) {
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field} <span className="text-xs text-gray-500">(JSON)</span>
                  </label>
                  <textarea
                    rows={6}
                    defaultValue={JSON.stringify(value, null, 2)}
                    onBlur={(e) => {
                      try {
                        updateField(field, JSON.parse(e.target.value));
                        setError("");
                      } catch {
                        setError(`JSON invalide dans le champ « ${field} ».`);
                      }
                    }}
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-amber-800 dark:text-amber-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              );
            }

            const strVal = value == null ? "" : String(value);
            const isLong = strVal.length > 90 || field.toLowerCase().includes("description");

            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field}</label>
                {isLong ? (
                  <textarea rows={3} value={strVal} onChange={(e) => updateField(field, e.target.value)} className={inputClass} />
                ) : (
                  <input
                    type={field.toLowerCase().includes("color") ? "color" : "text"}
                    value={strVal}
                    onChange={(e) => updateField(field, e.target.value)}
                    className={
                      field.toLowerCase().includes("color")
                        ? "h-10 w-24 rounded bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-pointer"
                        : inputClass
                    }
                  />
                )}
              </div>
            );
          })}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
