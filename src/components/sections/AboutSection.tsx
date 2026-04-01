"use client";

import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const floatersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax floating elements on scroll
    if (floatersRef.current) {
      const floaters = Array.from(floatersRef.current.children);
      floaters.forEach((el, i) => {
        gsap.to(el, {
          y: () => -100 - (i * 30),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    }

    // Card entrance
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <Section id="about" title="ABOUT ME">
      <div ref={containerRef} className="max-w-5xl mx-auto relative pt-10 pb-20">
        
        {/* Floating Background 3D Elements */}
        <div ref={floatersRef} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-0 md:-right-10 w-24 h-24 glass rounded-2xl border-primary/20 bg-primary/5 rotate-12 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <div className="absolute bottom-10 left-0 md:-left-10 w-32 h-20 glass rounded-xl border-secondary/20 bg-secondary/5 -rotate-6 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.15)]">
             <div className="flex items-end gap-1.5 h-10">
               <div className="w-1.5 h-full bg-secondary rounded-full" />
               <div className="w-1.5 h-1/2 bg-secondary rounded-full" />
               <div className="w-1.5 h-3/4 bg-secondary rounded-full" />
               <div className="w-1.5 h-1/4 bg-secondary rounded-full" />
             </div>
          </div>
          <div className="absolute top-1/2 -right-10 w-16 h-16 glass rounded-full border-accent/20 bg-accent/5 rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(255,46,99,0.15)] hidden md:flex">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
        </div>

        {/* Main Glass Card */}
        <div ref={cardRef} className="glass rounded-[2rem] p-8 md:p-14 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden z-10 bg-black/40 backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
          
          <div className="relative z-10 flex flex-col gap-8">
            <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              A Hybrid Core of <br className="hidden md:block"/>
              <span className="text-gradient">Logic & Creativity</span>
            </h3>
            
            <div className="space-y-6 text-lg md:text-xl text-foreground/80 font-medium leading-relaxed max-w-3xl">
              <p>
                Creative and results-driven strategist based in Finland, specializing in digital marketing, content creation, and automation systems.
              </p>
              <p>
                I combine storytelling with data to build high-performing content ecosystems across TikTok, YouTube, and modern platforms.
              </p>
              <p className="border-l-2 border-primary/50 pl-6 text-foreground/90 italic">
                With experience in brand collaborations, analytics optimization, and workflow automation using n8n, I focus on scaling impact — not just creating content.
              </p>
            </div>
            
            <div className="pt-6 flex flex-wrap gap-4">
              {['Content Strategy', 'n8n Automation', 'TikTok Growth', 'Data Analytics'].map((skill) => (
                <span key={skill} className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-extrabold tracking-wider text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:border-[#C1E8FF]/50 hover:text-[#C1E8FF] transition-all duration-300 cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
