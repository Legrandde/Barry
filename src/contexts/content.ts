import { createContext, useContext } from "react";
import type { SiteContent } from "../types/content";

export const ContentContext = createContext<SiteContent | undefined>(undefined);

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
