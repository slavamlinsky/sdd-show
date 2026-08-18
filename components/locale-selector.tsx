"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, useLocale } from "@/lib/locale-client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function LocaleSelector({ className }: Props) {
  const { locale, setLocale } = useLocale();
  const current = LOCALES.find((entry) => entry.code === locale);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-8 min-w-[4.75rem] cursor-pointer items-center justify-center gap-1 rounded-md border border-border/70 bg-background/80 px-2.5 text-xs font-semibold text-foreground shadow-sm transition-all outline-none",
          "hover:bg-muted/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
          "data-popup-open:bg-muted/70",
          className
        )}
      >
        {current?.label ?? "En"}
        <ChevronDownIcon className="size-3.5 opacity-60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[7.5rem]">
        {LOCALES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            className="cursor-pointer"
            onClick={() => setLocale(code)}
          >
            {label}
            {locale === code ? (
              <CheckIcon className="ml-auto size-4 text-primary" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
