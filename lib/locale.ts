/** UI locale codes (Ua → BCP 47 `uk` for Ukrainian). */
export const LOCALES = [
  { code: "en", label: "En", htmlLang: "en" },
  { code: "es", label: "Es", htmlLang: "es" },
  { code: "uk", label: "Ua", htmlLang: "uk" },
  { code: "de", label: "De", htmlLang: "de" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const LOCALE_COOKIE = "sdd-locale";
export const DEFAULT_LOCALE: LocaleCode = "en";

export function isLocaleCode(value: string): value is LocaleCode {
  return LOCALES.some((l) => l.code === value);
}

export function htmlLangForLocale(code: LocaleCode): string {
  return LOCALES.find((l) => l.code === code)?.htmlLang ?? "en";
}
