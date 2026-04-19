import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account — coming soon.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
      <p className="mt-3 text-muted-foreground">
        Registration isn’t wired up yet. Check back later, or continue exploring the site.
      </p>
      <Button className="mt-8" render={<Link href="/" />}>
        Back to home
      </Button>
    </div>
  );
}
