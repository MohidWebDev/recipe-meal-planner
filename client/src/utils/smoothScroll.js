import Lenis from 'lenis';

/**
 * Smooth (eased) mouse-wheel scrolling for the whole page, powered by Lenis.
 * Touch devices keep their native scrolling, and users who ask the OS for
 * reduced motion get normal scrolling.
 */
let lenis = null;

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    autoRaf: true,
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // ease-out-expo
    smoothWheel: true,
    anchors: true,
  });

  // Lenis re-measures the page on its own, but only after a short delay. Re-measure as soon as
  // the content height changes (e.g. when recipes finish loading) so the first scroll is never clamped.
  const observer = new ResizeObserver(() => lenis?.resize());
  observer.observe(document.body);

  return () => {
    observer.disconnect();
    lenis?.destroy();
    lenis = null;
  };
}

/** Scrolls the page to the top (smoothly unless `immediate`). */
export function scrollToTop({ immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true });
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' });
  }
}

/** Pauses page scrolling, e.g. while a modal is open. */
export function lockScroll() {
  lenis?.stop();
}

export function unlockScroll() {
  lenis?.start();
}
