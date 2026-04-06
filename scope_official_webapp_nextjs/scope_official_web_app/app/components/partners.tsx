"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import whatStyles from '../aboutus/sections/WhatWeDo/WhatWeDo.module.css';
import useContinuousScroll from '../lib/useContinuousScroll.client';

interface Partner {
  id: string;
  name: string;
  image_url: string;
  link?: string;
  show_on_website?: boolean;
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [repeatCount, setRepeatCount] = useState<number>(2);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Load partners from API (Supabase)
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        console.log('Partners: /api/partners status', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Partners: partners payload', data);
          if (data && data.partners) {
            setPartners(data.partners);
          }
        } else {
          console.error('Failed to fetch partners:', res.status);
        }
      } catch (e) {
        console.error('Failed to load partners', e);
      }
    };
    fetchPartners();
  }, []);

  // Adjust repeatCount responsively on mount/resize so the track can wrap
  useEffect(() => {
    const compute = () => {
      const c = containerRef.current;
      const t = trackRef.current;
      if (!c || !t) return;
      const singleWidth = t.scrollWidth || (c.clientWidth * 0.8);
      const needed = Math.min(12, Math.max(2, Math.ceil((c.clientWidth * 2) / Math.max(1, singleWidth / Math.max(1, repeatCount)))));
      if (needed !== repeatCount) setRepeatCount(needed);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [repeatCount]);

  // Register this partners track with the shared transform-based scroller
  useContinuousScroll(trackRef, { speed: 40, id: 'partners' });

  const visiblePartners = partners.filter((partner) => partner.show_on_website === true);

  if (visiblePartners.length === 0) {
    return (
      <section className="py-12 px-6 partners-root">
        <div className={`max-w-7xl mx-auto ${whatStyles.container}`}>
          <h3 className={whatStyles.programsTitle}>OUR PARTNERS</h3>
          <p className="text-gray-400">No visible partners yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 partners-root">
      <div className={`max-w-7xl mx-auto ${whatStyles.container}`}>
        <h3 className={whatStyles.programsTitle}>OUR PARTNERS</h3>
        <div className="relative overflow-hidden">
          <div ref={containerRef} id="partners-carousel" className="w-full overflow-x-hidden overflow-y-hidden" style={{ scrollBehavior: 'auto' }}>
            <div ref={trackRef} data-repeat={repeatCount} className="flex items-center gap-6 px-6 py-4">
              {Array.from({ length: repeatCount }).flatMap((_, r) =>
                visiblePartners.map((p, i) => (
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
