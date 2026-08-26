"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  BellOff,
  CheckCircle2,
  Loader2,
  LogIn,
  Video,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  setVideoUpdatesSubscription,
  suggestVideo,
} from "@/app/(shell-flush)/videos/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PILLAR_FILTER_ORDER, PILLAR_UI } from "@/lib/pillar-ui";
import {
  SUGGEST_VIDEO_WHY_MAX,
  suggestVideoFormSchema,
  type SuggestVideoFormValues,
} from "@/lib/videos-suggest";
import { cn } from "@/lib/utils";

const suggestBtnClass =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-primary/25 bg-accent/80 px-5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm hover:bg-primary/5 sm:w-auto";
const subscribeBtnClass =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-md shadow-primary/20 sm:w-auto";
const fieldClass = "rounded-md bg-white dark:bg-card";

const suggestFormDefaults: SuggestVideoFormValues = {
  youtubeUrl: "",
  whyItMatters: "",
  categories: [],
  website: "",
};

type Props = {
  signedIn: boolean;
  initiallySubscribed: boolean;
  subscribeIntent?: boolean;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function stripSubscribeQueryParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("subscribe")) return;
  url.searchParams.delete("subscribe");
  const query = url.searchParams.toString();
  window.history.replaceState(
    null,
    "",
    `${url.pathname}${query ? `?${query}` : ""}${url.hash}`,
  );
}

export function VideosHeaderActions({
  signedIn,
  initiallySubscribed,
  subscribeIntent = false,
}: Props) {
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [guestSubscribeOpen, setGuestSubscribeOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(initiallySubscribed);
  const [subscribePending, setSubscribePending] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [suggestDone, setSuggestDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(suggestVideoFormSchema),
    defaultValues: suggestFormDefaults,
  });

  const whyItMatters = watch("whyItMatters");
  const categories = watch("categories") ?? [];
  const youtubeUrlError = errors.youtubeUrl?.message;
  const whyItMattersError = errors.whyItMatters?.message;
  const categoriesError = errors.categories?.message;

  useEffect(() => {
    if (!signedIn || !subscribeIntent) return;

    if (initiallySubscribed) {
      stripSubscribeQueryParam();
      return;
    }

    let cancelled = false;

    async function subscribeFromQuery() {
      setSubscribeError(null);
      setSubscribePending(true);
      try {
        const result = await setVideoUpdatesSubscription(true);
        if (cancelled) return;
        if (!result.ok) {
          setSubscribeError(result.error);
          return;
        }
        setSubscribed(result.subscribed);
      } catch {
        if (!cancelled) {
          setSubscribeError("Could not update your subscription. Try again.");
        }
      } finally {
        if (!cancelled) {
          setSubscribePending(false);
          stripSubscribeQueryParam();
        }
      }
    }

    void subscribeFromQuery();
    return () => {
      cancelled = true;
    };
  }, [signedIn, subscribeIntent, initiallySubscribed]);

  function resetSuggest() {
    reset(suggestFormDefaults);
    setSuggestError(null);
    setSuggestDone(false);
  }

  async function onSuggest(values: SuggestVideoFormValues) {
    setSuggestError(null);
    try {
      const result = await suggestVideo({
        youtubeUrl: values.youtubeUrl,
        whyItMatters: values.whyItMatters,
        categories: values.categories,
        website: values.website,
      });
      if (!result.ok) {
        setSuggestError(result.error);
        return;
      }
      setSuggestDone(true);
    } catch {
      setSuggestError("Could not send your suggestion. Try again.");
    }
  }

  async function onToggleSubscribe() {
    setSubscribeError(null);
    setSubscribePending(true);
    const next = !subscribed;
    try {
      const result = await setVideoUpdatesSubscription(next);
      if (!result.ok) {
        setSubscribeError(result.error);
        return;
      }
      setSubscribed(result.subscribed);
    } catch {
      setSubscribeError("Could not update your subscription. Try again.");
    } finally {
      setSubscribePending(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 items-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={suggestBtnClass}
          onClick={() => {
            resetSuggest();
            setSuggestOpen(true);
          }}
        >
          <Video className="size-4 shrink-0" aria-hidden />
          Suggest a video
        </Button>
        {signedIn ? (
          <Button
            type="button"
            variant={subscribed ? "outline" : "default"}
            size="lg"
            className={cn(
              subscribeBtnClass,
              subscribed &&
                "border-emerald-400/40 bg-emerald-500/10 text-emerald-800 shadow-sm hover:bg-emerald-500/15 dark:text-emerald-100",
            )}
            disabled={subscribePending}
            aria-pressed={subscribed}
            onClick={() => void onToggleSubscribe()}
          >
            {subscribePending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : subscribed ? (
              <BellOff className="size-4 shrink-0" aria-hidden />
            ) : (
              <Bell className="size-4 shrink-0" aria-hidden />
            )}
            {subscribed ? "You're subscribed" : "Subscribe"}
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className={subscribeBtnClass}
            onClick={() => setGuestSubscribeOpen(true)}
          >
            <Bell className="size-4 shrink-0" aria-hidden />
            Subscribe
          </Button>
        )}
      </div>
      {subscribeError && signedIn ? (
        <p className="mt-2 text-sm text-destructive lg:text-right" role="alert">
          {subscribeError}
        </p>
      ) : null}

      <Dialog
        open={suggestOpen}
        onOpenChange={(open) => {
          setSuggestOpen(open);
          if (!open) resetSuggest();
        }}
      >
        <DialogContent
          showCloseButton
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl p-6"
        >
          <DialogHeader>
            <DialogTitle>Suggest a video</DialogTitle>
            <DialogDescription>
              Paste a YouTube link and tell us why it belongs here. We review
              every suggestion before it appears in the library.
            </DialogDescription>
          </DialogHeader>

          {suggestDone ? (
            <div className="py-4 text-center" role="status">
              <CheckCircle2
                className="mx-auto size-10 text-primary"
                aria-hidden
              />
              <p className="mt-3 font-heading text-base font-semibold">
                Thanks — we received your video.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                It sits in a review queue. Nothing is published automatically.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSuggest)}
              className="relative space-y-6 text-left"
              aria-busy={isSubmitting}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="video-youtube-url">YouTube link</Label>
                <Input
                  id="video-youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=…"
                  className={cn("h-10", fieldClass)}
                  aria-invalid={Boolean(youtubeUrlError)}
                  aria-describedby={
                    youtubeUrlError ? "video-youtube-error" : undefined
                  }
                  {...register("youtubeUrl")}
                  disabled={isSubmitting}
                />
                <FieldError
                  id="video-youtube-error"
                  message={youtubeUrlError}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="video-why">Why it matters</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {(whyItMatters ?? "").length}/{SUGGEST_VIDEO_WHY_MAX}
                  </span>
                </div>
                <Textarea
                  id="video-why"
                  maxLength={SUGGEST_VIDEO_WHY_MAX}
                  rows={4}
                  placeholder="What you liked — a workflow, a demo, a framing that would help others here."
                  className={fieldClass}
                  aria-invalid={Boolean(whyItMattersError)}
                  aria-describedby={
                    whyItMattersError ? "video-why-error" : undefined
                  }
                  {...register("whyItMatters")}
                  disabled={isSubmitting}
                />
                <FieldError
                  id="video-why-error"
                  message={whyItMattersError}
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Topics</legend>
                <div
                  className="grid grid-cols-4 gap-2 pt-1"
                  role="group"
                  aria-label="Topics"
                  aria-invalid={Boolean(categoriesError)}
                  aria-describedby={
                    categoriesError ? "video-topics-error" : undefined
                  }
                >
                  {PILLAR_FILTER_ORDER.map((pillar) => {
                    const on = categories.includes(pillar);
                    const { icon: Icon, idle, active } = PILLAR_UI[pillar];
                    return (
                      <button
                        key={pillar}
                        type="button"
                        aria-pressed={on}
                        disabled={isSubmitting}
                        onClick={() =>
                          setValue(
                            "categories",
                            on
                              ? categories.filter((item) => item !== pillar)
                              : [...categories, pillar],
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                        className={cn(
                          "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-semibold shadow-sm transition-all sm:text-xs",
                          on ? active : idle,
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span className="truncate">{pillar}</span>
                      </button>
                    );
                  })}
                </div>
                <FieldError
                  id="video-topics-error"
                  message={categoriesError}
                />
              </fieldset>

              <div
                className="absolute -left-[2499.75px] h-0 w-0 overflow-hidden"
                aria-hidden
              >
                <Label htmlFor="video-website">Website</Label>
                <Input
                  id="video-website"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              {suggestError ? (
                <p className="text-sm text-destructive" role="alert">
                  {suggestError}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full gap-2 rounded-xl font-semibold shadow-md shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Video className="size-4" aria-hidden />
                )}
                {isSubmitting ? "Sending…" : "Send suggestion"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={guestSubscribeOpen} onOpenChange={setGuestSubscribeOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to video updates</DialogTitle>
            <DialogDescription>
              Get a note when we add a talk to this library. Sign in with the
              same account you use on this site — we store a subscribe flag on
              your profile, not a separate list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              After you sign in we turn the flag on and this button becomes
              “You&apos;re subscribed”. You can turn it off any time.
            </p>
            <Button
              nativeButton={false}
              size="lg"
              className="h-11 w-full cursor-pointer gap-2 rounded-xl font-semibold shadow-md shadow-primary/20"
              render={
                <Link
                  href={`/sign-in?next=${encodeURIComponent("/videos?subscribe=1")}`}
                />
              }
            >
              <LogIn className="size-4 shrink-0" aria-hidden />
              Sign in to subscribe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
