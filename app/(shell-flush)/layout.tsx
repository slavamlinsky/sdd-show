import { PageShellFlush } from "@/components/page-shell";

export default function ShellFlushLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PageShellFlush>{children}</PageShellFlush>;
}
