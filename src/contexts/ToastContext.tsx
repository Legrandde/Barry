import { useCallback, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastContext, type ToastVariant } from "./toast";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const DURATION_MS = 3800;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss]
  );

  const success = useCallback((message: string) => show(message, "success"), [show]);
  const error = useCallback((message: string) => show(message, "error"), [show]);
  const info = useCallback((message: string) => show(message, "info"), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}

      <div
        className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const styles =
            t.variant === "success"
              ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
              : t.variant === "error"
                ? "border-red-500/40 text-red-600 dark:text-red-300"
                : "border-amber-500/40 text-amber-700 dark:text-amber-300";

          const Icon = t.variant === "success" ? CheckCircle2 : t.variant === "error" ? AlertCircle : Info;

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border shadow-xl transition-all ${styles}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="p-0.5 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                aria-label="Fermer la notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
