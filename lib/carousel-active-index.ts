/**
 * Active carousel dot when several slides can be visible at once.
 * Using “nearest slide center to viewport center” mostly highlights the middle
 * card (e.g. indices 1–2 only with 3-up layout). Prefer the slide with the
 * largest visible width inside the track viewport; break ties with the lowest index.
 */
export function getActiveCarouselSlideIndex(
  track: HTMLDivElement,
  slides: readonly (HTMLElement | null)[]
): number {
  const viewL = track.scrollLeft;
  const viewR = viewL + track.clientWidth;
  let bestI = 0;
  let bestVis = -1;

  for (let i = 0; i < slides.length; i++) {
    const el = slides[i];
    if (!el) continue;
    const L = el.offsetLeft;
    const R = L + el.offsetWidth;
    const vis = Math.max(0, Math.min(R, viewR) - Math.max(L, viewL));

    if (vis > bestVis) {
      bestVis = vis;
      bestI = i;
    } else if (vis === bestVis && vis > 0) {
      bestI = Math.min(bestI, i);
    }
  }

  return bestI;
}
