import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { FooterRegion } from "@/components/footer-region";
import { ScrollToTop } from "@/components/scroll-to-top";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
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
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={cn(
          plusJakarta.className,
          "min-h-full flex flex-col bg-background text-foreground"
        )}
      >
        <SiteHeader />
        <main id="main-content" className="flex-1 scroll-mt-0 outline-none" tabIndex={-1}>
          {children}
        </main>
        <FooterRegion />
        <ScrollToTop />
      </body>
    </html>
  );
}
