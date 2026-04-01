"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const logos = [
  "GIGABYTE", "YAMAHA", "bKash", "KICKS & SIX", "NexGen Fusion 3D", "Mayfair Global Education", "GIGABYTE", "YAMAHA", "bKash", "KICKS & SIX", "NexGen Fusion 3D", "Mayfair Global Education"
];

export function LogoMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: "linear",
    });
  }, { scope: marqueeRef });

  return (
    <div className="py-16 border-y border-white/5 bg-black/20 overflow-hidden relative flex">
      <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div ref={marqueeRef} className="flex whitespace-nowrap min-w-max">
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="px-10 md:px-20 text-4xl md:text-6xl font-black text-transparent bg-clip-text hover:text-white/20 transition-colors duration-500" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)' }}>
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
