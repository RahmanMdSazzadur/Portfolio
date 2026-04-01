"use client";

import { useState } from "react";
import gsap from "gsap";

export function EntryOverlay({ onEnter }: { onEnter: () => void }) {
  const [exited, setExited] = useState(false);

  const handleEnter = () => {
    // Cinematic GSAP wipe sequence blurring DOM and simulating 3D zoom speed
    gsap.to(".entry-ui", {
      opacity: 0,
      scale: 2,
      filter: "blur(30px)",
      duration: 1.5,
      ease: "power4.inOut",
      onComplete: () => {
        setExited(true);
        onEnter();
      }
    });
    
    gsap.to(".entry-overlay", {
      backgroundColor: "rgba(0,0,0,0)",
      backdropFilter: "blur(0px)",
      duration: 1.5,
      ease: "power4.inOut"
    });
  };

  if (exited) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-2xl entry-overlay pointer-events-auto">
      <div className="entry-ui flex flex-col items-center text-center">
        <div className="text-xs font-mono text-[#C1E8FF] mb-6 tracking-[0.4em] uppercase opacity-60 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
          Neural OS Framework v2.0
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] mix-blend-screen">
          System Initialized
        </h1>
        
        <button 
          onClick={handleEnter}
          className="relative group px-14 py-5 glass bg-black/40 border border-[#C1E8FF]/40 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#C1E8FF] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
        >
          <div className="absolute inset-0 bg-[#C1E8FF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,240,255,0.4),transparent)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 text-[#C1E8FF] font-bold tracking-[0.2em] uppercase text-sm drop-shadow-[0_0_15px_rgba(0,240,255,1)]">
            Establish Uplink
          </span>
        </button>
      </div>
    </div>
  );
}
