import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Eye, EyeOff, Save } from "lucide-react";
import {
  getSection,
  getSectionVisibility,
  patchSection,
  setSectionVisibility,
  type SectionVisibility,
} from "../../services/adminApi";
import { CONTENT_CACHE_KEY } from "../../contexts/ContentContext";

export default function SectionEditor() {
  const { key = "site" } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

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
      setNotice(updated.isVisible ? "Section affichée sur le site." : "Section masquée sur le site.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de visibilité.");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const inputClass =
    "w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Chargement de la section « {key} »...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">Section : {key}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Modifiez les textes, images ou réglages de ce bloc.</p>
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
        <form onSubmit={handleSave} className="space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
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

            if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
              const isStringArray = Array.isArray(value) && value.every((v) => typeof v === "string");
              if (isStringArray) {
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field} <span className="text-xs text-gray-500">(une entrée par ligne)</span>
                    </label>
                    <textarea
                      rows={Math.max(3, (value as string[]).length + 1)}
                      value={(value as string[]).join("\n")}
                      onChange={(e) =>
                        updateField(
                          field,
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
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field} <span className="text-xs text-gray-500">(JSON)</span>
                  </label>
                  <textarea
                    rows={8}
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
