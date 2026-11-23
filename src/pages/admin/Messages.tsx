import { useEffect, useState } from "react";
import { Check, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, listMessages, markMessageRead, type ContactMessage } from "../../services/adminApi";
import ConfirmDialog from "../../component/admin/ConfirmDialog";
import { useToast } from "../../contexts/toast";

export default function Messages() {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    listMessages()
      .then(setMessages)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    try {
      await markMessageRead(msg.id, !msg.isRead);
      toast.info(msg.isRead ? "Message marqué comme non lu." : "Message marqué comme lu.");
      load();
    } catch (err) {
      const m = err instanceof Error ? err.message : "Erreur de mise à jour.";
      setError(m);
      toast.error(m);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError("");
    try {
      await deleteMessage(pendingDelete.id);
      toast.success("Message supprimé.");
      setPendingDelete(null);
      load();
    } catch (err) {
      const m = err instanceof Error ? err.message : "Erreur de suppression.";
      setError(m);
      toast.error(m);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages de contact</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Messages envoyés depuis le formulaire du portfolio.</p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          Aucun message reçu pour l'instant.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl p-5 border ${
                msg.isRead
                  ? "bg-white/70 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"
                  : "bg-white dark:bg-gray-900 border-amber-500/50"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{msg.subject}</span>
                    {!msg.isRead && <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-white">Nouveau</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {msg.name} · {msg.email}
                    {msg.phone ? ` · ${msg.phone}` : ""} · {new Date(msg.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(msg)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    title={msg.isRead ? "Marquer non lu" : "Marquer comme lu"}
                  >
                    {msg.isRead ? <MailOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setPendingDelete(msg)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-500/15 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{msg.message}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer ce message"
        description={
          pendingDelete
            ? `Voulez-vous vraiment supprimer le message « ${pendingDelete.subject} » de ${pendingDelete.name} ?`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
