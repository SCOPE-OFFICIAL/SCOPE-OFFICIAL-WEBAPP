"use client";

import { useEffect } from "react";

type ScrollerState = {
  el: HTMLElement;
  offset: number;
  speed: number; // px per second
  wrapWidth: number;
  id?: string;
};

const GLOBAL_KEY = "__scope_continuous_scroller__" as const;

function getGlobal(): any {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (!w[GLOBAL_KEY]) {
    w[GLOBAL_KEY] = {
      scrollers: new Map<string, ScrollerState>(),
      rafId: null as number | null,
      lastTime: 0,
      start() {
        if (this.rafId) return;
        this.lastTime = performance.now();
        const loop = (t: number) => {
          const dt = (t - this.lastTime) / 1000;
          this.lastTime = t;
          for (const s of this.scrollers.values()) {
            try {
              if (!s.el || s.wrapWidth <= 0) continue;
              if (s.el.dataset && s.el.dataset.paused === "1") {
                s.el.style.transform = `translate3d(${-Math.round(s.offset)}px,0,0)`;
                continue;
              }
              s.offset += s.speed * dt;
              // Seamless infinite loop in BOTH directions
              // Forward (right): wrap when exceeds wrapWidth
              if (s.offset >= s.wrapWidth) {
                s.offset = s.offset % s.wrapWidth;
              }
              // Backward (left): wrap when goes below 0
              // Add wrapWidth to bring it back to the end of the cycle
              else if (s.offset < 0) {
                s.offset = s.wrapWidth + (s.offset % s.wrapWidth);
              }
              s.el.style.transform = `translate3d(${-Math.round(s.offset)}px,0,0)`;
            } catch {}
          }
          this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
      },
      stopIfIdle() {
        if (this.rafId && this.scrollers.size === 0) {
          try { cancelAnimationFrame(this.rafId); } catch {}
          this.rafId = null;
        }
      }
    };
  }
  return w[GLOBAL_KEY];
}

export type UseContinuousScrollOptions = {
  speed?: number;
  id?: string;
};

export function useContinuousScroll(trackRef: { current: HTMLElement | null }, opts?: UseContinuousScrollOptions) {
  const speed = opts?.speed ?? 50;
  const id = opts?.id ?? `scroller_${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    const w = getGlobal();
    if (!w) return;

    let mounted = true;
    let ro: ResizeObserver | null = null;
    let resizeHandler = () => {};
    let pollTimer: number | null = null;
    let attempts = 0;
    const maxAttempts = 40;

    const registerWithElement = (elParam: HTMLElement) => {
      if (!mounted) return;
      const el = elParam;
      el.style.willChange = "transform";
      el.style.transform = "translate3d(0,0,0)";

      // Start at middle position to allow scrolling in both directions
      const state: ScrollerState = { el, offset: 0, speed, wrapWidth: 0, id };

      const computeWrap = () => {
        try {
          const total = el.scrollWidth || el.clientWidth || 0;
          // If the track element provides a data-repeat attribute we use it to
          // compute the wrap width as (total / repeat). This allows callers
          // to choose how many repeated blocks they render and ensures the
          // scroller wraps by one block width (not by half the total which
          // was the previous hard-coded behavior).
          let repeat = 2;
          try {
            const r = parseInt(el.dataset?.repeat || "", 10);
            if (!Number.isNaN(r) && r > 0) repeat = r;
          } catch {}
          state.wrapWidth = total > 0 ? Math.max(1, Math.floor(total / Math.max(1, repeat))) : Math.max(1, total);
          
          // Initialize offset to middle of content for bidirectional scrolling
          // Only set initial position once, when offset is still 0
          if (state.offset === 0 && state.wrapWidth > 0) {
            // Start at 50% through one cycle so user can scroll both directions
            state.offset = state.wrapWidth * 0.5;
          }
          // Ensure offset wraps correctly within bounds
          else if (state.wrapWidth > 0) {
            state.offset = state.offset % state.wrapWidth;
          }
          try {
            if (state.id === "gallery" || state.wrapWidth <= 2) {
              console.debug("[useContinuousScroll] computeWrap", { id: state.id, total, repeat, wrapWidth: state.wrapWidth, offset: state.offset });
            }
          } catch {}
        } catch {}
      };

      computeWrap();
      try { console.debug("[useContinuousScroll] register", { id, speed, initialWrap: state.wrapWidth }); } catch {}
      w.scrollers.set(id, state);
      w.start();

      resizeHandler = () => computeWrap();
      window.addEventListener("resize", resizeHandler);

      try {
        if (typeof ResizeObserver !== "undefined") {
          ro = new ResizeObserver(() => computeWrap());
          ro.observe(el);
        }
      } catch { ro = null; }

      let monitorObserver: MutationObserver | null = null;

      const cleanup = () => {
        window.removeEventListener("resize", resizeHandler);
        try { if (ro) ro.disconnect(); } catch {}
        try { w.scrollers.delete(id); } catch {}
        try { if (monitorObserver) monitorObserver.disconnect(); } catch {}
        w.stopIfIdle();
      };

      // If the element is ever removed from the DOM (e.g. view transitions),
      // automatically cleanup the scroller so it can be re-registered later.
      try {
        if (typeof MutationObserver !== 'undefined' && document && document.body) {
          monitorObserver = new MutationObserver(() => {
            try {
              if (!el.isConnected) {
                // element removed: cleanup and restart polling to re-register when it returns
                cleanup();
                attempts = 0;
                // start polling again to pick up a future re-inserted track
                if (mounted) {
                  // small timeout to allow DOM updates
                  window.setTimeout(() => { try { poll(); } catch {} }, 50);
                }
              }
            } catch {}
          });
          monitorObserver.observe(document.body, { childList: true, subtree: true });
        }
      } catch {}

      return cleanup;
    };

    if (trackRef?.current) {
      const cleanup = registerWithElement(trackRef.current);
      return () => { mounted = false; try { if (cleanup) cleanup(); } catch {} };
    }

    const poll = function poll() {
      attempts++;
      const cur = trackRef?.current;
      if (cur) {
        registerWithElement(cur);
        return;
      }
      if (attempts < maxAttempts && mounted) {
        pollTimer = window.setTimeout(poll, 100) as unknown as number;
      }
    };
    poll();

    return () => { mounted = false; try { if (pollTimer) window.clearTimeout(pollTimer); } catch {} };
  }, [trackRef, speed, opts?.id, id]);
}

export default useContinuousScroll;
