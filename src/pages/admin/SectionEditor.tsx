import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Eye, EyeOff, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import {
  getSection,
  getSectionVisibility,
  patchSection,
  setSectionVisibility,
  type SectionVisibility,
} from "../../services/adminApi";
import { CONTENT_CACHE_KEY } from "../../contexts/ContentContext";
import { useToast } from "../../contexts/toast";

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
        setData(content);
        setVisibility(vis);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."))
      .finally(() => setLoading(false));
  }, [key]);

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
          <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">Section : {key}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Modifiez les textes, images, réglages ou glissez-déposez les éléments de liste.
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

      {data && (
        <form onSubmit={handleSave} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {Object.entries(data).map(([field, value]) => {
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
