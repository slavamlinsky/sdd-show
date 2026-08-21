import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { FooterRegion } from "@/components/footer-region";
import { ScrollToTop } from "@/components/scroll-to-top";
import { LocaleInit } from "@/components/locale-init";
import { JsonLd } from "@/components/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import {
  avatarUrlFromMetadata,
  displayNameFromAuth,
} from "@/lib/auth-display";
import {
  DEFAULT_LOCALE,
  htmlLangForLocale,
  isLocaleCode,
  LOCALE_COOKIE,
} from "@/lib/locale";
import { websiteJsonLd } from "@/lib/json-ld";
import { keywordsFromClusters } from "@/lib/seo-keywords";
import { shareMetadata } from "@/lib/seo-page-meta";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { getAuthUser } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: keywordsFromClusters("sddCore", "intent"),
  ...shareMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
    image: siteConfig.defaultShareImage,
  }),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();
  const userEmail = user?.email ?? null;
  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const userAvatarUrl = avatarUrlFromMetadata(meta);
  const userDisplayName =
    userEmail != null ? displayNameFromAuth(userEmail, meta) : null;

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale =
    localeCookie && isLocaleCode(localeCookie) ? localeCookie : DEFAULT_LOCALE;

  return (
    <html
      lang={htmlLangForLocale(locale)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={cn(
          inter.className,
          "min-h-full flex flex-col bg-background text-foreground"
        )}
      >
        <JsonLd data={websiteJsonLd()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleInit />
          <SiteHeader
            userEmail={userEmail}
            userDisplayName={userDisplayName}
            userAvatarUrl={userAvatarUrl}
          />
          <main
            id="main-content"
            className="min-w-0 flex-1 scroll-mt-16 outline-none w-full pt-16"
            tabIndex={-1}
          >
            <ScrollToTop />
            {children}
          </main>
          <FooterRegion />
        </ThemeProvider>
      </body>
    </html>
  );
}
