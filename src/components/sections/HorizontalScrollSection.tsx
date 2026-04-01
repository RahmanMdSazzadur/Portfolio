"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const processSteps = [
  { step: "01", title: "Discovery & Audit", text: "Deep dive into your current ecosystem, traffic sources, and hidden drop-offs." },
  { step: "02", title: "Content Engine", text: "Developing algorithmic, high-retention video arrays that dominate FYPs." },
  { step: "03", title: "Growth Architecture", text: "Building automated CRM routing and frictionless lead-capture forms." },
  { step: "04", title: "Scale & Optimize", text: "Iterative A/B testing on creatives to drop CAC and skyrocket LTV." }
];

export function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".horizontal-panel");
    const getScrollAmount = () => {
      let trackWidth = trackRef.current ? trackRef.current.scrollWidth : 0;
      return -(trackWidth - window.innerWidth);
    };
    
    gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${getScrollAmount() * -1}`,
        invalidateOnRefresh: true,
      }
    });

    // Reveal text in each panel as it approaches center screen
    sections.forEach((panel: any) => {
      gsap.fromTo(panel.querySelector('.panel-content'), 
        { opacity: 0, scale: 0.8 }, 
        { 
          opacity: 1, 
          scale: 1, 
          scrollTrigger: {
            trigger: panel,
            containerAnimation: gsap.getById("horizontal-tween"),
            start: "left center",
            end: "center center",
            scrub: true
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen bg-transparent overflow-hidden relative border-y border-white/5">
      <div className="absolute top-12 left-12 md:top-24 md:left-24 z-10 mix-blend-difference pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">The Process</h2>
      </div>

      <div ref={trackRef} className="flex h-full w-[400vw] md:w-[200vw]" style={{ width: `${processSteps.length * 100}vw` }}>
        {processSteps.map((item, i) => (
          <div key={i} className="horizontal-panel w-screen h-full flex items-center justify-center p-8 md:p-24 relative border-r border-white/5 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C1E8FF]/5 via-transparent to-[#5483B3]/5 opacity-40 pointer-events-none" />
            <div className="panel-content w-full max-w-2xl glass p-12 md:p-20 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/10 relative">
              <div className="text-[8rem] md:text-[14rem] font-black absolute -top-20 -left-12 text-white/5 tracking-tighter leading-none select-none pointer-events-none">
                {item.step}
              </div>
              <h3 className="text-4xl md:text-6xl font-extrabold text-white mb-6 relative z-10 tracking-tight">{item.title}</h3>
              <p className="text-xl md:text-2xl text-foreground/70 font-medium relative z-10 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
