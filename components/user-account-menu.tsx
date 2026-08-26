"use client";

import { Languages, LogOut, SunMoon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { LocaleSelector } from "@/components/locale-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initialsFromDisplayName } from "@/lib/auth-display";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
};

const menuItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm font-normal tracking-normal text-foreground";

const menuPrefRowClass =
  "flex items-center justify-between gap-3 rounded-md px-2";

const menuPrefLabelClass =
  "flex items-center gap-2.5 text-sm font-normal tracking-normal text-foreground";

/** Header account control: avatar trigger, profile, theme, language, sign out. */
export function UserAccountMenu({ email, displayName, avatarUrl }: Props) {
  const router = useRouter();
  const signOutFormRef = useRef<HTMLFormElement>(null);
  const initials = initialsFromDisplayName(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "flex size-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted/80 text-primary shadow-md ring-2 ring-background transition-all outline-none",
          "hover:border-primary/30 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-popup-open:border-primary/40 data-popup-open:ring-primary/20",
        )}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar host varies (Google, etc.)
          <img
            src={avatarUrl}
            alt=""
            className="size-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-sm font-semibold leading-none">{initials}</span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="flex w-[min(calc(100vw-2rem),17.5rem)] flex-col rounded-lg p-1.5 font-sans shadow-xl ring-1 ring-foreground/5"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-normal normal-case">
            <p className="truncate text-sm font-medium tracking-normal text-foreground">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs font-normal tracking-normal text-muted-foreground">
              {email}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className={menuItemClass}
          onClick={() => router.push("/account")}
        >
          <User className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          User profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="space-y-0.5 py-1.5">
          <div className={menuPrefRowClass}>
            <span className={menuPrefLabelClass}>
              <SunMoon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              Theme
            </span>
            <ThemeToggle variant="switch" />
          </div>
          {/* <div className={menuPrefRowClass}>
            <span className={menuPrefLabelClass}>
              <Languages
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              Language
            </span>
            <LocaleSelector />
          </div> */}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className={menuItemClass}
          onClick={() => signOutFormRef.current?.requestSubmit()}
        >
          <LogOut
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          Sign out
        </DropdownMenuItem>
        <form
          ref={signOutFormRef}
          action="/auth/sign-out"
          method="post"
          hidden
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch("/auth/sign-out", { method: "POST" });
            if (!response.ok) {
              window.alert("Could not sign out. Try again.");
              return;
            }
            window.location.assign("/");
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
