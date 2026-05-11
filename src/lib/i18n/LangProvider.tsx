"use client";

// ====== LangProvider — context React pour la langue côté client ======
// Reçoit la langue initiale (déterminée server-side via cookie/header) et
// expose un hook `useT(key)` et un setter `setLang(lang)` qui écrit le cookie.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { translate, type Lang, DEFAULT_LANG } from "./dict";

const COOKIE_NAME = "esprit_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({
  initialLang = DEFAULT_LANG,
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Si jamais le client a un cookie différent (cas où l'user a switché et le
  // server n'a pas vu — edge case soft navigation), on synchronise au mount.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const fromCookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1];
    if (fromCookie === "fr" || fromCookie === "en") {
      if (fromCookie !== lang) setLangState(fromCookie);
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    // Force un refresh server-side pour que les metadata + server components s'alignent
    if (typeof window !== "undefined") {
      // Reload de la page courante — propre pour récupérer les chaînes server-rendered
      window.location.reload();
    }
  }, []);

  const tFn = useCallback((key: string) => translate(key, lang), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: tFn }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Fallback hors provider : renvoie DEFAULT_LANG sans crash
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (key: string) => translate(key, DEFAULT_LANG),
    };
  }
  return ctx;
}

export function useT(): (key: string) => string {
  return useLang().t;
}
