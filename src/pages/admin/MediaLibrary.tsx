import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { deleteMedia, listMedia, uploadMedia, type MediaItem } from "../../services/adminApi";
import ConfirmDialog from "../../component/admin/ConfirmDialog";
import { useToast } from "../../contexts/toast";

export default function MediaLibrary() {
  const toast = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    listMedia()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."));
  };

  useEffect(() => {
    load();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    setError("");
    let uploadedCount = 0;
    try {
      for (const file of list) {
        await uploadMedia(file);
        uploadedCount++;
      }
      toast.success(
        uploadedCount > 1 ? `${uploadedCount} médias téléversés avec succès !` : "Média téléversé avec succès !"
      );
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec du téléversement.";
      setError(msg);
      toast.error(msg);
      if (uploadedCount > 0) load();
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url).catch(() => {});
    setCopiedId(item.id);
    toast.info("URL copiée dans le presse-papiers.");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError("");
    try {
      await deleteMedia(pendingDelete.id);
      toast.success("Média supprimé.");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Médiathèque</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Glissez-déposez vos images (20 Mo max) ou vidéos (300 Mo max, compression auto).
          </p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? "Envoi..." : "Téléverser"}
          <input type="file" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {/* Zone de dépôt Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "border-amber-500 bg-amber-500/10 scale-[1.01]"
            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/60 hover:border-amber-500/50"
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-amber-500" : "text-gray-400"}`} />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {uploading
            ? "Téléversement en cours..."
            : isDragging
              ? "Relâchez pour téléverser les fichiers"
              : "Glissez-déposez un ou plusieurs fichiers ici"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, WebP, GIF, AVIF, MP4, WebM</p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      {items.length === 0 ? (
        <p className="text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          Aucun média téléversé.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col">
              <div className="h-44 bg-gray-100 dark:bg-gray-950 flex items-center justify-center overflow-hidden">
                {item.contentType.startsWith("video/") ? (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.originalName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(item.size / 1024).toFixed(1)} Ko {item.status === "processing" ? "· compression..." : ""}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => copyUrl(item)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    title="Copier l'URL"
                  >
                    <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </button>
                  <button
                    onClick={() => setPendingDelete(item)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-500/15 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>
              {copiedId === item.id && <p className="px-3 pb-2 text-xs text-emerald-600 dark:text-emerald-400">URL copiée !</p>}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer ce média"
        description={
          pendingDelete
            ? `Voulez-vous vraiment supprimer « ${pendingDelete.originalName} » ? Le fichier sera définitivement effacé.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
