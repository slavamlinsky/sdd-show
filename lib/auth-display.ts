/** Display name from Supabase `user_metadata` (Google: full_name / name) or email local part. */
export function displayNameFromAuth(
  email: string,
  metadata?: Record<string, unknown> | null
): string {
  const raw = metadata?.full_name ?? metadata?.name;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  const local = email.split("@")[0]?.trim();
  return local || email;
}

export function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  const one = parts[0] ?? "";
  if (one.length >= 2) return one.slice(0, 2).toUpperCase();
  return (one[0] ?? "?").toUpperCase();
}

export function avatarUrlFromMetadata(
  metadata?: Record<string, unknown> | null
): string | null {
  if (!metadata) return null;
  if (typeof metadata.avatar_url === "string" && metadata.avatar_url) {
    return metadata.avatar_url;
  }
  if (typeof metadata.picture === "string" && metadata.picture) {
    return metadata.picture;
  }
  return null;
}
