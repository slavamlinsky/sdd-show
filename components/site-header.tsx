"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { LogIn } from "lucide-react";
import headerLogo from "@/public/logo.png";
import headerLogoWhite from "@/public/logo-white.png";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountMenu } from "@/components/user-account-menu";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  userEmail,
  userDisplayName,
  userAvatarUrl,
}: {
  userEmail: string | null;
  userDisplayName: string | null;
  userAvatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const isSignedIn = Boolean(userEmail && userDisplayName);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40 w-full border-b border-border/40 bg-background/75 shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] backdrop-blur-xl supports-backdrop-filter:bg-background/60 dark:border-border/50 dark:bg-background/70 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.04)]"
    >
      <a
        href="#main-content"
        className="bg-background text-foreground fixed left-4 top-4 z-100 -translate-y-[200%] rounded-full border border-border px-4 py-2 text-sm font-medium shadow-md outline-none transition-transform duration-200 ease-out focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} (home)`}
          className="flex shrink-0 items-center rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Image
            src={headerLogo}
            alt={siteConfig.name}
            className="h-12 w-auto dark:hidden sm:h-16 lg:h-20"
            priority
          />
          <Image
            src={headerLogoWhite}
            alt=""
            className="hidden h-12 w-auto dark:block sm:h-16 lg:h-20"
            priority
          />
        </Link>

        <nav
          className="hidden flex-1 justify-center gap-1 md:flex"
          aria-label="Main"
        >
          {mainNav.map(({ href, label }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          {!isSignedIn ? (
            <ThemeToggle className="hidden rounded-full md:inline-flex" />
          ) : null}
          {isSignedIn && userEmail && userDisplayName ? (
            <UserAccountMenu
              email={userEmail}
              displayName={userDisplayName}
              avatarUrl={userAvatarUrl}
            />
          ) : (
            <Button
              variant="outline"
              nativeButton={false}
              className="h-10 cursor-pointer gap-2 rounded-full border-primary/30 bg-primary/5 px-5 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary/45 hover:bg-primary/10 hover:shadow-md"
              render={<Link href="/sign-in" />}
            >
              <LogIn className="size-4 shrink-0" aria-hidden />
              Sign in
            </Button>
          )}

          <MobileNavDrawer
            headerRef={headerRef}
            showThemeInDrawer={!isSignedIn}
          />
        </div>
      </div>
    </header>
  );
}
