import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { fetchSiteContent } from "../services/api";
import { applyTheme } from "../services/theme";
import { applySeo } from "../services/seo";
import { defaultContent } from "../data/defaultContent";
import type { SiteContent } from "../types/content";
import { ContentContext } from "./content";

export const CONTENT_CACHE_KEY = "barry-portfolio-content-v1";
const FALLBACK_DELAY_MS = 2500;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function withDefaults(data: SiteContent): SiteContent {
  const merged: Record<string, unknown> = { ...defaultContent };
  for (const [key, value] of Object.entries(data)) {
    const fallback = merged[key];
    merged[key] = isPlainObject(fallback) && isPlainObject(value) ? { ...fallback, ...value } : value;
  }
  return merged as unknown as SiteContent;
}

function readCache(): SiteContent {
  try {
    const cached = localStorage.getItem(CONTENT_CACHE_KEY);
    return cached ? withDefaults(JSON.parse(cached) as SiteContent) : defaultContent;
  } catch {
    return defaultContent;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(readCache);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setContent((current) => current ?? defaultContent);
    }, FALLBACK_DELAY_MS);

    fetchSiteContent(controller.signal)
      .then((data) => {
        const merged = withDefaults(data);
        setContent(merged);
        try {
          localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(data));
        } catch {
          // Stockage indisponible (navigation privée...)
        }
      })
      .catch(() => {
        // Garde le cache ou defaultContent si l'API est injoignable
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  useLayoutEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  useEffect(() => {
    applySeo(content);
  }, [content]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
