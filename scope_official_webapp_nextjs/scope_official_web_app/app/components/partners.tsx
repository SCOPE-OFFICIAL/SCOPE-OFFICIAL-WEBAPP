"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import whatStyles from '../aboutus/sections/WhatWeDo/WhatWeDo.module.css';

interface Partner {
  id: string;
  name: string;
  image_url: string;
  link?: string;
}

const LOCAL_KEY = 'partners_data_v1';

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [repeatCount, setRepeatCount] = useState<number>(2);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const attemptsRef = useRef<number>(0);

  // Load partners from localStorage or seed defaults
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        setPartners(JSON.parse(raw));
      } else {
        const defaults: Partner[] = [
          { id: 'ieee', name: 'IEEE', image_url: '/images/partners/ieee.png', link: 'https://ieee.org' },
          { id: 'ieee-ss', name: 'IEEE Signal Processing Society', image_url: '/images/partners/ieee-sps.png', link: 'https://signalprocessingsociety.org' },
          { id: 'atlassian', name: 'Atlassian', image_url: '/images/partners/atlassian.png', link: 'https://atlassian.com' },
          { id: 'mathworks', name: 'MathWorks', image_url: '/images/partners/mathworks.png', link: 'https://mathworks.com' }
        ];
        setPartners(defaults);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(defaults));
      }
    } catch (e) {
      console.error('Failed to load partners', e);
    }
  }, []);

  // Continuous RAF loop with robust try-start and debug info
  useEffect(() => {
    let previousScrollBehavior = '';
    let lastTime = performance.now();
    const speed = 40; // px / sec

    let containerLocal: HTMLDivElement | null = null;
    let trackLocal: HTMLDivElement | null = null;

  let lastDebugUpdate = 0;

    const animate = (time: number) => {
      if (!containerLocal || !trackLocal) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      containerLocal.scrollLeft += speed * delta;

      const half = trackLocal.scrollWidth / 2;
      if (half > 0 && containerLocal.scrollLeft >= half) {
        containerLocal.scrollLeft -= half;
      }

      // (no on-screen debug badge) keep a very light console.debug periodically
      if (time - lastDebugUpdate > 1000) {
        lastDebugUpdate = time;
        try {
          // occasional measurement log for developers
          console.debug('[Partners RAF] measure', { trackWidth: trackLocal.scrollWidth, containerWidth: containerLocal.clientWidth, scrollLeft: Math.round(containerLocal.scrollLeft) });
        } catch {
          // ignore
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    let startTimer: number | null = null;
    let attempts = 0;
    const maxAttempts = 60;

    const tryStart = () => {
  attempts += 1;
  attemptsRef.current = attempts;
  if (rafRef.current) return; // already running

  // starting (console only)
  console.log('[Partners RAF] attempting start, attempt', attempts);
      containerLocal = containerRef.current;
      trackLocal = trackRef.current;

      // Ensure measurable layout and that track overflows container
      if (!containerLocal || !trackLocal || trackLocal.scrollWidth <= 0 || containerLocal.clientWidth <= 0) {
        if (attempts < maxAttempts) {
          startTimer = window.setTimeout(tryStart, 150);
        } else {
          console.log('[Partners RAF] tryStart max attempts reached - aborting');
        }
        return;
      }

      // Check if track is wide enough for wrapping; if not, increase repeats
      const baseWidth = trackLocal.scrollWidth;
      const singleCopyWidth = baseWidth / Math.max(1, repeatCount);
      if (baseWidth < containerLocal.clientWidth * 2) {
        const needed = Math.min(12, Math.max(2, Math.ceil((containerLocal.clientWidth * 2) / Math.max(1, singleCopyWidth))));
        if (needed > repeatCount) {
          console.log('[Partners RAF] increasing repeatCount to', needed);
          setRepeatCount(needed);
          startTimer = window.setTimeout(tryStart, 150);
          return;
        }
        if (attempts < maxAttempts) {
          startTimer = window.setTimeout(tryStart, 150);
          return;
        }
      }

      previousScrollBehavior = containerLocal.style.scrollBehavior || '';
      containerLocal.style.scrollBehavior = 'auto';

      try { containerLocal.scrollLeft = 0; } catch {}

  lastTime = performance.now();
  rafRef.current = requestAnimationFrame(animate);
  console.log('[Partners RAF] started');
    };

    startTimer = window.setTimeout(tryStart, 120);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
  if (containerLocal) containerLocal.style.scrollBehavior = previousScrollBehavior || '';
  console.log('[Partners RAF] stopped');
    };
  }, [partners, repeatCount]);
  return (
    <section className="py-12 px-6 partners-root">
      <div className={`max-w-7xl mx-auto ${whatStyles.container}`}>
        <h3 className={whatStyles.programsTitle}>OUR PARTNERS</h3>
        <div className="relative overflow-hidden">
          <div ref={containerRef} id="partners-carousel" className="w-full overflow-x-auto overflow-y-hidden" style={{ scrollBehavior: 'auto' }}>
            <div ref={trackRef} className="flex items-center gap-6 px-6 py-4">
              {Array.from({ length: repeatCount }).flatMap((_, r) =>
                partners.map((p, i) => (
                  <a key={`${p.id}-${r}-${i}`} href={p.link || '#'} target="_blank" rel="noreferrer" className="flex-shrink-0 w-48 h-28 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                    <Image src={p.image_url} alt={p.name} width={192} height={80} className="max-h-20 max-w-full object-contain" />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* hide scrollbars for the partners carousel */
        #partners-carousel { scrollbar-width: none; -ms-overflow-style: none; }
        #partners-carousel::-webkit-scrollbar { display: none; height: 0; }
      `}</style>
    </section>
  );
}
