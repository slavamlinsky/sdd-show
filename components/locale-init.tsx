"use client";

import { useEffect } from "react";
import { applyLocale, readLocaleCookie } from "@/lib/locale-client";

/** Apply saved locale to `<html lang>` on first client paint. */
export function LocaleInit() {
  useEffect(() => {
    applyLocale(readLocaleCookie());
  }, []);
  return null;
}
