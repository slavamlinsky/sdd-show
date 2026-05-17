/**
 * Carousel pagination when several slides can be visible at once.
 * Dots and prev/next represent scroll *pages* (first-slide indices), not one dot per item.
 */

/** How many slide columns fit in the track viewport (measured). */
export function getCarouselSlidesPerView(
  track: HTMLDivElement,
  slides: readonly (HTMLElement | null)[],
  itemCount: number
): number {
  const nonempty = slides.filter((x): x is HTMLElement => x != null);
  if (nonempty.length === 0 || itemCount <= 0) return 1;

  const s0 = nonempty[0];
  const w = s0.offsetWidth;
  const s1 = nonempty[1];
  const gap = s1 ? s1.offsetLeft - s0.offsetLeft - w : 0;
  const unit = w + gap;
  if (unit <= 0) return 1;

  const raw = Math.floor((track.clientWidth + gap) / unit);
  return Math.min(itemCount, Math.max(1, raw));
}

/** Number of dot / page positions: one per valid “first visible slide” index. */
export function getCarouselPageCount(
  itemCount: number,
  slidesPerView: number
): number {
  if (itemCount <= 0) return 1;
  const v = Math.min(itemCount, Math.max(1, slidesPerView));
  return Math.max(1, itemCount - v + 1);
}

/**
 * Active page index (0 … pageCount-1): nearest scroll snap to a page start
 * (`slide[p].offsetLeft - paddingLeft`).
 */
export function getActiveCarouselPageIndex(
  track: HTMLDivElement,
  slides: readonly (HTMLElement | null)[],
  itemCount: number
): number {
  if (itemCount <= 0) return 0;

  const V = getCarouselSlidesPerView(track, slides, itemCount);
  const pageCount = getCarouselPageCount(itemCount, V);
  const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const scrollL = track.scrollLeft;

  let best = 0;
  let bestDist = Infinity;

  for (let p = 0; p < pageCount; p++) {
    const el = slides[p];
    if (!el) continue;
    const target = Math.max(0, el.offsetLeft - pad);
    const d = Math.abs(scrollL - target);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    } else if (d === bestDist) {
      best = Math.min(best, p);
    }
  }

  return best;
}
