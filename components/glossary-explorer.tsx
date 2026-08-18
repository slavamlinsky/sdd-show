"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GlossaryAccordion } from "@/components/glossary-accordion";
import { Input } from "@/components/ui/input";
import {
  allPillarsOn,
  filterGlossaryTerms,
  parsePillarHash,
  parsePillarsQuery,
  serializePillarsQuery,
} from "@/lib/glossary-filter";
import type { GlossaryTerm } from "@/lib/glossary-data";
import { PILLAR_FILTER_ORDER, PILLAR_UI } from "@/lib/pillar-ui";
import type { Pillar } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 250;

type Props = {
  terms: GlossaryTerm[];
  /** From `?pillars=` on the server; hash is applied on the client. */
  initialPillars?: string | null;
};

export function GlossaryExplorer({ terms, initialPillars = null }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pillarsOn, setPillarsOn] = useState<Set<Pillar>>(
    () => parsePillarsQuery(initialPillars) ?? allPillarsOn(),
  );
  const [urlReady, setUrlReady] = useState(() =>
    Boolean(parsePillarsQuery(initialPillars)),
  );

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!initialPillars?.trim()) {
      const fromHash = parsePillarHash(window.location.hash);
      if (fromHash) setPillarsOn(new Set([fromHash]));
    }
    setUrlReady(true);
  }, [initialPillars]);

  useEffect(() => {
    const onHash = () => {
      if (new URLSearchParams(window.location.search).get("pillars")) return;
      const fromHash = parsePillarHash(window.location.hash);
      if (fromHash) setPillarsOn(new Set([fromHash]));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    const serialized = serializePillarsQuery(pillarsOn);
    if (serialized) url.searchParams.set("pillars", serialized);
    else url.searchParams.delete("pillars");
    if (parsePillarHash(url.hash)) url.hash = "";
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [pillarsOn, urlReady]);

  function togglePillar(pillar: Pillar) {
    setPillarsOn((current) => {
      const next = new Set(current);
      if (next.has(pillar)) {
        if (next.size === 1) return allPillarsOn();
        next.delete(pillar);
        return next;
      }
      next.add(pillar);
      return next;
    });
  }

  const visible = useMemo(
    () => filterGlossaryTerms(terms, debouncedQuery, pillarsOn),
    [terms, debouncedQuery, pillarsOn],
  );

  return (
    <div className="mt-8">
      <div
        id="glossary-filters"
        className="flex flex-col gap-3 lg:gap-8 lg:flex-row lg:items-center"
      >
        <div className="relative min-w-0 w-1/2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            aria-label="Search glossary"
            className="h-11 rounded-xl bg-white pr-10 pl-10 shadow-sm dark:bg-card"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div
          className="grid w-full grid-cols-4 gap-2 lg:gap-4 lg:w-1/2"
          role="group"
          aria-label="Filter by pillar"
        >
          {PILLAR_FILTER_ORDER.map((pillar) => {
            const on = pillarsOn.has(pillar);
            const { icon: Icon, idle, active } = PILLAR_UI[pillar];
            return (
              <button
                key={pillar}
                type="button"
                aria-pressed={on}
                onClick={() => togglePillar(pillar)}
                className={cn(
                  "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-semibold shadow-sm transition-all sm:flex-row sm:gap-1.5 sm:text-xs",
                  on ? active : `${idle} opacity-55 grayscale-[0.35]`,
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{pillar}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {visible.length === terms.length
          ? `${terms.length} terms`
          : `${visible.length} of ${terms.length} terms`}
      </p>

      {visible.length === 0 ? (
        <p
          className="mt-10 text-center text-sm text-muted-foreground"
          role="status"
        >
          No terms match this search and pillar mix. Try another query or turn
          more pillars on.
        </p>
      ) : (
        <GlossaryAccordion terms={visible} />
      )}
    </div>
  );
}
