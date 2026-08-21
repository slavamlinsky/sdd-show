import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GradientText } from "@/components/gradient-text";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { avatarUrlFromMetadata, displayNameFromAuth } from "@/lib/auth-display";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.account);

export default async function AccountPage() {
  const user = await getAuthUser();
  if (!user?.email) {
    redirect("/sign-in");
  }

  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const displayName = displayNameFromAuth(user.email, meta);
  const avatarUrl = avatarUrlFromMetadata(meta);

  return (
    <div className="mx-auto max-w-lg">
      <h1>
        User <GradientText className="font-semibold">profile</GradientText>
      </h1>
      <p className="mt-3 text-muted-foreground">
        Account details from your sign-in provider. Editing your display name
        will come in a later update.
      </p>

      <dl className="mt-8 space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm ring-1 ring-foreground/3 sm:p-6">
        {avatarUrl ? (
          <div className="flex justify-center pb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="size-20 rounded-full border border-border/80 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Name
          </dt>
          <dd className="mt-1 text-base font-medium text-foreground">
            {displayName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 text-base text-foreground">{user.email}</dd>
        </div>
      </dl>
    </div>
  );
}
