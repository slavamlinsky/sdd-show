import { PageShellPadded } from "@/components/page-shell";

export default function ShellPaddedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PageShellPadded>{children}</PageShellPadded>;
}
