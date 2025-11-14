"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// No CSS import is needed

interface Partner {
  id: string;
  name: string;
  image_url: string;
  link?: string;
}

export default function PartnersTicker({ className = '' }: { className?: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          if (data?.partners) setPartners(data.partners);
        } else {
          console.error('PartnersTicker: failed to fetch partners', res.status);
        }
      } catch (err) {
        console.error('PartnersTicker: error loading partners', err);
      }
    };

    fetchPartners();
  }, []);

  if (!partners || partners.length === 0) return null;

  // We must wrap the component and the style tag in a single fragment
  return (
    <>
      <section className={`py-12 px-6 partners-root ${className}`}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-6">OUR PARTNERS</h3>

          {/* Use the new CSS class for the container */}
          <div className="ticker-container-css">
            
            {/* Use the new CSS class for the track */}
            <div 
              className="ticker-track-css" 
              style={{
                // Pass the number of logos as a CSS variable
                '--num-logos': partners.length,
              } as React.CSSProperties}
            >
              {/* Render two sets for seamless loop */}
              {Array.from({ length: 2 }).flatMap((_, r) =>
                partners.map((p) => (
                  
                  // Use the new CSS class for the item
                  <div className="logo-item-css" key={`${p.id}-${r}`}>
                    <a 
                      href={p.link || '#'} 
                      target="_blank" 
                      rel="noreferrer" 
                      // Keep the Tailwind styles for the logo's appearance
                      className="flex-shrink-0 w-48 h-28 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"
                    >
                      <Image 
                        src={p.image_url} 
                        alt={p.name} 
                        width={192} 
                        height={80} 
                        className="max-h-20 max-w-full object-contain" 
                        priority={false} 
                      />
                    </a>
                  </div>

                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* This <style jsx> tag injects the CSS directly.
        It is scoped to this component, so it won't clash with other styles.
      */}
      <style jsx>{`
        /* The main container - 'overflow: hidden' is the key */
        .ticker-container-css {
          width: 100%;
          overflow: hidden;
          /* Using the mask from your original React component */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        /* The track that holds and moves the logos */
        .ticker-track-css {
          display: flex;
          align-items: center;
          
          /* * --num-logos is passed from the React component via inline style.
           * --logo-width is a fixed size for each logo container.
           * 16rem (256px) gives plenty of space for your w-48 (192px) logo + padding.
          */
          --logo-width: 16rem; 
          --animation-speed: 35s; /* Adjust speed as needed (longer for more logos) */
          
          /* Calculate the total width for 2 sets of logos */
          width: calc(var(--logo-width) * var(--num-logos) * 2);
          
          /* The animation */
          animation: scroll-css var(--animation-speed) linear infinite;
        }

        /* Do not pause on hover: keep the ticker continuously scrolling so users
           can still interact with links while motion continues. */

        /* The Keyframes */
        @keyframes scroll-css {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Move left by the width of *one* full set of logos */
            transform: translateX(calc(var(--logo-width) * var(--num-logos) * -1));
          }
        }

        /* Styling for each logo item */
        .logo-item-css {
          flex-shrink: 0; /* Prevents logos from shrinking */
          width: var(--logo-width); /* Each item takes up the full logo-width */
          
          /* Use flex to center the link/image inside this container */
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}