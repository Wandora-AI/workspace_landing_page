import { createContext, useContext, useEffect, useState } from "react";

export const VARIANTS = [
  { id: "classic", label: "Classic" },
  { id: "hub", label: "Command Hub" },
  { id: "bento", label: "Bento" },
];

const STORAGE_KEY = "workspace_ui_variant";
const DEFAULT_VARIANT = "hub";
const VALID_IDS = new Set(VARIANTS.map((variant) => variant.id));

function initialVariant() {
  const fromUrl = new URLSearchParams(window.location.search).get("variant");
  if (fromUrl && VALID_IDS.has(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_IDS.has(stored)) return stored;
  } catch {
    // storage unavailable (private mode) — fall through to default
  }
  return DEFAULT_VARIANT;
}

const VariantContext = createContext({
  variant: DEFAULT_VARIANT,
  setVariant: () => {},
});

export function VariantProvider({ children }) {
  const [variant, setVariant] = useState(initialVariant);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, variant);
    } catch {
      // ignore
    }
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variant);
    window.history.replaceState(null, "", url);
  }, [variant]);

  return (
    <VariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  return useContext(VariantContext);
}
