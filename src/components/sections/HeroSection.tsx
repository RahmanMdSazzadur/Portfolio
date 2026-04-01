"use client";

import { BlurText } from "@/components/ui/blur-text";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden w-full pt-10">
      
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Centered Main Name */}
      <div className="relative w-full max-w-[1400px] px-4 flex flex-col items-center justify-center z-10 -mt-20">
        <div className="relative text-center w-full">
          <div>
            <BlurText
              text="SAZZADUR"
              delay={80}
              animateBy="letters"
              direction="top"
              className="font-black text-[11vw] sm:text-[120px] md:text-[150px] lg:text-[180px] leading-[0.8] tracking-tighter uppercase mb-4 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] justify-center flex w-full"
              style={{ fontFamily: "'Fira Code', monospace" }}
            />
          </div>
          <div>
            <BlurText
              text="RAHMAN"
              delay={80}
              animateBy="letters"
              direction="bottom"
              className="font-black text-[11vw] sm:text-[120px] md:text-[150px] lg:text-[180px] leading-[0.8] tracking-tighter uppercase text-primary drop-shadow-[0_0_30px_rgba(0,240,255,0.2)] justify-center flex w-full"
              style={{ fontFamily: "'Fira Code', monospace" }}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <div className="w-[100px] h-[150px] sm:w-[140px] sm:h-[200px] md:w-[160px] md:h-[230px] lg:w-[200px] lg:h-[280px] rounded-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-4 border-white/10 transition-transform duration-500 hover:scale-110 hover:border-primary/50 cursor-pointer glass backdrop-blur-xl">
              <img
                src="/sazzadur_photo.jpg"
                alt="Md Sazzadur Rahman"
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tagline */}
      <div className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center">
        <BlurText
          text="Digital Marketing Strategist & Automation Engineer"
          delay={120}
          animateBy="words"
          direction="top"
          className="text-sm sm:text-lg md:text-xl font-medium tracking-wide text-foreground/80 text-center uppercase"
        />
        <div className="mt-4 flex items-center gap-4 opacity-0 animate-[fadeIn_1s_ease-out_1.5s_forwards]">
          <span className="w-16 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
          <span className="text-xs font-bold tracking-widest text-[#C1E8FF] uppercase">Based in BD</span>
          <span className="w-16 h-[2px] bg-gradient-to-l from-transparent to-secondary"></span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
        <ChevronDown className="w-6 h-6 text-foreground/50 animate-bounce" />
      </div>

    </section>
  );
}
