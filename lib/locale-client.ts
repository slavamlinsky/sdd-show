"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_LOCALE,
  htmlLangForLocale,
  isLocaleCode,
  LOCALE_COOKIE,
  LOCALES,
  type LocaleCode,
} from "@/lib/locale";

export function readLocaleCookie(): LocaleCode {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`)
  );
  const val = match?.[1];
  return val && isLocaleCode(val) ? val : DEFAULT_LOCALE;
}

export function applyLocale(code: LocaleCode) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = htmlLangForLocale(code);
  document.cookie = `${LOCALE_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
}

const localeListeners = new Set<() => void>();

function subscribeLocale(cb: () => void) {
  localeListeners.add(cb);
  return () => localeListeners.delete(cb);
}

function emitLocaleChange() {
  localeListeners.forEach((cb) => cb());
}

function getLocaleSnapshot(): LocaleCode {
  return readLocaleCookie();
}

function getLocaleServerSnapshot(): LocaleCode {
  return DEFAULT_LOCALE;
}

export function useLocale() {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getLocaleServerSnapshot
  );

  const setLocale = (code: LocaleCode) => {
    applyLocale(code);
    emitLocaleChange();
  };

  return { locale, setLocale };
}

export { LOCALES };
