import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Image as ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createCollectionItem,
  deleteCollectionItem,
  listCollection,
  listMedia,
  reorderCollection,
  updateCollectionItem,
  type MediaItem,
} from "../../services/adminApi";
import { CONTENT_CACHE_KEY } from "../../contexts/ContentContext";
import { useToast } from "../../contexts/toast";
import ConfirmDialog from "../../component/admin/ConfirmDialog";

interface AnyItem {
  id: number;
  position: number;
  isPublished: boolean;
  [key: string]: unknown;
}

type FieldType = "text" | "textarea" | "select" | "number" | "tags" | "lines" | "image" | "skills" | "checkbox";

interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

const SCHEMAS: Record<string, { title: string; defaults: Record<string, unknown>; fields: FieldDef[] }> = {
  projects: {
    title: "Projets",
    defaults: {
      title: "",
      slug: "",
      description: "",
      mainImage: "",
      images: [],
      type: "web",
      category: "Web Development",
      technologies: [],
      liveUrl: "",
      demoUrl: "",
      githubUrl: "",
      isPublished: true,
    },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug (optionnel, généré auto)", type: "text", placeholder: "mon-projet" },
      { name: "type", label: "Type", type: "select", options: ["web", "mobile", "desktop", "other"] },
      { name: "category", label: "Catégorie", type: "text", placeholder: "Web Development" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "mainImage", label: "Image principale", type: "image", placeholder: "teranga/terangaBanner.png ou URL" },
      { name: "images", label: "Galerie d'images (une URL/chemin par ligne)", type: "lines" },
      { name: "technologies", label: "Technologies (séparées par des virgules)", type: "tags", placeholder: "React, FastAPI, PostgreSQL" },
      { name: "liveUrl", label: "URL en ligne (optionnel)", type: "text", placeholder: "https://..." },
      { name: "demoUrl", label: "URL démo (optionnel)", type: "text", placeholder: "https://..." },
      { name: "githubUrl", label: "URL GitHub (optionnel)", type: "text", placeholder: "https://github.com/..." },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  services: {
    title: "Services",
    defaults: { title: "", description: "", icon: "web", isPublished: true },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icône", type: "select", options: ["web", "mobile", "api", "consulting", "code", "cloud", "design", "default"] },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  "skill-categories": {
    title: "Catégories de compétences",
    defaults: { name: "", icon: "code", skills: [{ name: "", level: 80 }], isPublished: true },
    fields: [
      { name: "name", label: "Nom de la catégorie", type: "text", required: true, placeholder: "Frontend" },
      { name: "icon", label: "Icône", type: "select", options: ["code", "database", "mobile", "cloud", "tools", "default"] },
      { name: "skills", label: "Compétences", type: "skills" },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  experiences: {
    title: "Parcours professionnel",
    defaults: { title: "", company: "", period: "", description: "", technologies: [], isPublished: true },
    fields: [
      { name: "title", label: "Poste / Rôle", type: "text", required: true },
      { name: "company", label: "Entreprise", type: "text", required: true },
      { name: "period", label: "Période", type: "text", required: true, placeholder: "Février 2026 - Juin 2026" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "technologies", label: "Technologies (séparées par des virgules)", type: "tags", placeholder: "React Native, Django, IoT" },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  educations: {
    title: "Formations",
    defaults: { degree: "", institution: "", period: "", description: "", achievements: [], isPublished: true },
    fields: [
      { name: "degree", label: "Diplôme", type: "text", required: true },
      { name: "institution", label: "Établissement", type: "text", required: true },
      { name: "period", label: "Période", type: "text", required: true, placeholder: "2024 - 2026" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "achievements", label: "Mentions / Réalisations (une par ligne)", type: "lines" },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  testimonials: {
    title: "Témoignages",
    defaults: { name: "", role: "", company: "", image: "", rating: 5, text: "", isPublished: true },
    fields: [
      { name: "name", label: "Nom du client", type: "text", required: true },
      { name: "role", label: "Poste", type: "text", placeholder: "CEO" },
      { name: "company", label: "Entreprise", type: "text" },
      { name: "image", label: "Photo", type: "image", placeholder: "URL de la photo" },
      { name: "rating", label: "Note (1 à 5)", type: "number", min: 1, max: 5 },
      { name: "text", label: "Témoignage", type: "textarea" },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
  "social-links": {
    title: "Réseaux sociaux",
    defaults: { label: "", url: "", icon: "website", isPublished: true },
    fields: [
      { name: "label", label: "Libellé", type: "text", required: true, placeholder: "GitHub" },
      { name: "url", label: "URL", type: "text", required: true, placeholder: "https://github.com/..." },
      {
        name: "icon",
        label: "Icône",
        type: "select",
        options: ["github", "linkedin", "x", "twitter", "facebook", "instagram", "youtube", "tiktok", "whatsapp", "website", "email"],
      },
      { name: "isPublished", label: "Publié sur le portfolio", type: "checkbox" },
    ],
  },
};

function itemTitle(item: AnyItem): string {
  return String(item.title ?? item.name ?? item.degree ?? item.label ?? `#${item.id}`);
}

function itemSubtitle(item: AnyItem): string {
  return String(item.company ?? item.institution ?? item.category ?? item.url ?? item.role ?? "");
}

function clearFrontCache() {
  try {
    localStorage.removeItem(CONTENT_CACHE_KEY);
  } catch {
    // ignore storage errors
  }
}

export default function CollectionManager() {
  const { collection = "projects" } = useParams();
  const schema = SCHEMAS[collection] ?? SCHEMAS.projects;
  const toast = useToast();
  const [items, setItems] = useState<AnyItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null | undefined>(undefined);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AnyItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [skillDragIndex, setSkillDragIndex] = useState<number | null>(null);
  const [skillDragOverIndex, setSkillDragOverIndex] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    listCollection<AnyItem>(collection)
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setEditingId(undefined);
    setPickerField(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const openMediaPicker = (fieldName: string) => {
    setPickerField(fieldName);
    listMedia()
      .then((m) => setMediaList(m.filter((item) => item.contentType.startsWith("image/"))))
      .catch(() => {});
  };

  const openCreate = () => {
    setForm(structuredClone(schema.defaults));
    setEditingId(null);
  };

  const openEdit = (item: AnyItem) => {
    const next: Record<string, unknown> = { ...structuredClone(schema.defaults) };
    for (const f of schema.fields) {
      if (item[f.name] !== undefined && item[f.name] !== null) {
        next[f.name] = structuredClone(item[f.name]);
      }
    }
    setForm(next);
    setEditingId(item.id);
  };

  const updateField = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    for (const f of schema.fields) {
      const val = form[f.name];
      if (f.name === "slug" && !String(val ?? "").trim()) {
        continue;
      }
      if ((f.name === "liveUrl" || f.name === "demoUrl" || f.name === "githubUrl") && !String(val ?? "").trim()) {
        payload[f.name] = null;
        continue;
      }
      if (f.type === "skills") {
        const rows = Array.isArray(val) ? val : [];
        payload[f.name] = rows
          .filter((r: { name?: string }) => String(r?.name ?? "").trim())
          .map((r: { name: string; level: number }) => ({ name: r.name.trim(), level: Number(r.level) || 0 }));
        continue;
      }
      payload[f.name] = val;
    }
    return payload;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId === undefined) return;
    setError("");
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId === null) {
        await createCollectionItem(collection, payload);
        toast.success("Élément ajouté avec succès !");
      } else {
        await updateCollectionItem(collection, editingId, payload);
        toast.success("Modifications enregistrées !");
      }
      clearFrontCache();
      setEditingId(undefined);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (item: AnyItem) => {
    try {
      await updateCollectionItem(collection, item.id, { isPublished: !item.isPublished });
      clearFrontCache();
      toast.success(item.isPublished ? "Élément masqué (brouillon)." : "Élément publié sur le site.");
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de mise à jour.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = (item: AnyItem) => {
    setPendingDelete(item);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCollectionItem(collection, pendingDelete.id);
      clearFrontCache();
      toast.success(`« ${itemTitle(pendingDelete)} » supprimé.`);
      setPendingDelete(null);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de suppression.";
      setError(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    await commitReorder(index, target);
  };

  const commitReorder = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setItems(next);
    try {
      const updated = await reorderCollection<AnyItem>(
        collection,
        next.map((i) => i.id)
      );
      clearFrontCache();
      setItems(updated);
      toast.success("Ordre mis à jour.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de réordonnancement.";
      setError(msg);
      toast.error(msg);
      load();
    }
  };

  const handleDragStart = (index: number, e: DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (index: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDrop = async (targetIndex: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceIndex = dragIndex;
    setDragIndex(null);
    setDragOverIndex(null);
    if (sourceIndex !== null && sourceIndex !== targetIndex) {
      await commitReorder(sourceIndex, targetIndex);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const inputClass =
    "w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";
  const iconBtnClass =
    "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{schema.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Créez, modifiez, masquez ou glissez-déposez les éléments pour changer l'ordre.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">Aucun élément pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(idx, e)}
              onDragOver={(e) => handleDragOver(idx, e)}
              onDrop={(e) => handleDrop(idx, e)}
              onDragEnd={handleDragEnd}
              className={`flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900 border rounded-xl p-4 transition-all select-none cursor-grab active:cursor-grabbing ${
                dragIndex === idx
                  ? "opacity-50 border-amber-500 scale-[0.99]"
                  : dragOverIndex === idx
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">{itemTitle(item)}</span>
                    {!item.isPublished && (
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">Brouillon</span>
                    )}
                  </div>
                  {itemSubtitle(item) && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{itemSubtitle(item)}</p>}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className={iconBtnClass}
                  title="Monter"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === items.length - 1}
                  className={iconBtnClass}
                  title="Descendre"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTogglePublished(item)}
                  className={iconBtnClass}
                  title={item.isPublished ? "Dépublier" : "Publier"}
                >
                  {item.isPublished ? <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className={iconBtnClass}
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-500/15 cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId === null ? `Nouvel élément · ${schema.title}` : `Modifier #${editingId}`}
              </h3>
              <button onClick={() => setEditingId(undefined)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {schema.fields.map((field) => {
                const value = form[field.name];

                if (field.type === "checkbox") {
                  return (
                    <label key={field.name} className="flex items-center gap-2.5 text-sm pt-1">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => updateField(field.name, e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-gray-700 dark:text-gray-200">{field.label}</span>
                    </label>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <select
                        value={String(value ?? "")}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className={inputClass}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <textarea
                        rows={3}
                        required={field.required}
                        value={String(value ?? "")}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                  );
                }

                if (field.type === "number") {
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        value={Number(value ?? field.min ?? 0)}
                        onChange={(e) => updateField(field.name, Number(e.target.value))}
                        className="w-32 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  );
                }

                if (field.type === "tags") {
                  const arr = Array.isArray(value) ? (value as string[]) : [];
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <input
                        type="text"
                        value={arr.join(", ")}
                        onChange={(e) =>
                          updateField(
                            field.name,
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                  );
                }

                if (field.type === "lines") {
                  const arr = Array.isArray(value) ? (value as string[]) : [];
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <textarea
                        rows={3}
                        value={arr.join("\n")}
                        onChange={(e) =>
                          updateField(
                            field.name,
                            e.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  );
                }

                if (field.type === "image") {
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={String(value ?? "")}
                          onChange={(e) => updateField(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className={`flex-1 ${inputClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker(field.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs text-amber-600 dark:text-amber-400 border border-gray-300 dark:border-gray-700 cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4" /> Médiathèque
                        </button>
                      </div>
                    </div>
                  );
                }

                if (field.type === "skills") {
                  const rows = Array.isArray(value) ? (value as { name: string; level: number }[]) : [];
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                        <button
                          type="button"
                          onClick={() => updateField(field.name, [...rows, { name: "", level: 80 }])}
                          className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 cursor-pointer"
                        >
                          + Ajouter une compétence
                        </button>
                      </div>
                      {rows.map((row, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => setSkillDragIndex(idx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (skillDragOverIndex !== idx) setSkillDragOverIndex(idx);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (skillDragIndex !== null && skillDragIndex !== idx) {
                              const next = [...rows];
                              const [moved] = next.splice(skillDragIndex, 1);
                              next.splice(idx, 0, moved);
                              updateField(field.name, next);
                            }
                            setSkillDragIndex(null);
                            setSkillDragOverIndex(null);
                          }}
                          onDragEnd={() => {
                            setSkillDragIndex(null);
                            setSkillDragOverIndex(null);
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                            skillDragIndex === idx
                              ? "opacity-50 border-amber-500"
                              : skillDragOverIndex === idx
                                ? "border-amber-500 bg-amber-500/5"
                                : "border-transparent"
                          }`}
                        >
                          <GripVertical className="w-4 h-4 text-gray-400 shrink-0 cursor-grab" />
                          <input
                            type="text"
                            placeholder="Ex: React"
                            value={row.name}
                            onChange={(e) => {
                              const next = [...rows];
                              next[idx] = { ...row, name: e.target.value };
                              updateField(field.name, next);
                            }}
                            className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={row.level}
                            onChange={(e) => {
                              const next = [...rows];
                              next[idx] = { ...row, level: Number(e.target.value) };
                              updateField(field.name, next);
                            }}
                            className="w-20 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
                          <button
                            type="button"
                            onClick={() => updateField(field.name, rows.filter((_, i) => i !== idx))}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                    <input
                      type="text"
                      required={field.required}
                      value={String(value ?? "")}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(undefined)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pickerField && (
        <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">Choisir une image de la médiathèque</h3>
              <button onClick={() => setPickerField(null)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {mediaList.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucune image téléversée dans la médiathèque pour le moment.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      updateField(pickerField, m.url);
                      setPickerField(null);
                    }}
                    className="group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-amber-500 text-left cursor-pointer"
                  >
                    <img src={m.url} alt={m.originalName} className="w-full h-28 object-cover" />
                    <p className="p-2 text-xs truncate text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{m.originalName}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Confirmer la suppression"
        description={
          pendingDelete
            ? `Voulez-vous vraiment supprimer « ${itemTitle(pendingDelete)} » ? Cette action est irréversible.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
