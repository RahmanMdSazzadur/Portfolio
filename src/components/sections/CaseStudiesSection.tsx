"use client";

import { useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const cases = [
  {
    title: "SaaS Growth Engine",
    metric: "+340%",
    metricLabel: "Lead Generation",
    description: "Built an automated content pipeline and email warming sequence that tripled inbound qualified leads in 90 days. We restructured their entire top-of-funnel acquisition process.",
    color: "from-[#C1E8FF]/20 to-transparent",
    border: "border-[#C1E8FF]/30",
    beforeImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "E-Commerce Scaling",
    metric: "2.8x",
    metricLabel: "ROAS Improvement",
    description: "Restructured performance marketing creatives and implemented behavioral retargeting to maximize ad efficiency. Achieved record-breaking Q4 revenue under strict efficiency limits.",
    color: "from-[#5483B3]/20 to-transparent",
    border: "border-[#5483B3]/30",
    beforeImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1504868584819-f818b4528156?auto=format&fit=crop&q=80&w=1000",
  }
];

export function CaseStudiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Cross-fade the left side info cards sequentially based on right-side scroll intersection
    const rightCards = gsap.utils.toArray(".case-right");
    const leftCards = gsap.utils.toArray(".case-left");

    rightCards.forEach((card: any, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onEnter: () => activateLeftCard(i),
        onEnterBack: () => activateLeftCard(i),
      });
    });

    function activateLeftCard(index: number) {
      // Fade out all
      gsap.to(leftCards, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.out" });
      // Fade in active
      gsap.to(leftCards[index] as HTMLElement, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", overwrite: true });
    }

  }, { scope: containerRef });

  return (
    <Section id="work" className="py-20 relative !overflow-visible">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 relative flex flex-col md:flex-row items-start gap-12">
        
        {/* Left Content (CSS Sticky Pinned Panel) */}
        <div ref={leftColRef} className="w-full md:w-5/12 h-screen flex flex-col justify-center sticky top-0 z-20">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Case <span className="text-gradient">Studies</span>
          </h2>
          <p className="text-xl text-foreground/60 mb-12 max-w-lg font-medium">
            Drag the cursor scrubber horizontally across imagery to reveal the structural before-and-after transformations.
          </p>
          
          <div className="relative h-[400px] w-full mt-4">
            {cases.map((study, index) => (
              <div
                key={`left-${index}`}
                className={cn(
                  "case-left absolute inset-0 flex flex-col justify-center p-8 md:p-12 rounded-[3rem] glass flex-shrink-0 backdrop-blur-3xl bg-gradient-to-tr shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/10 will-change-transform",
                  study.color, study.border,
                  index === 0 ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}
              >
                <h3 className="text-3xl font-extrabold mb-4">{study.title}</h3>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">{study.metric}</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/50">{study.metricLabel}</span>
                </div>
                <p className="text-lg text-white/80 leading-relaxed font-medium">
                  {study.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content (Scrolling Scrubber Components) */}
        <div className="w-full md:w-7/12 flex flex-col gap-[30vh] pt-[15vh] pb-[50vh] relative z-10">
          {cases.map((study, index) => (
            <div key={`right-${index}`} className="case-right relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden glass border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group">
              <BeforeAfterSlider before={study.beforeImage} after={study.afterImage} />
            </div>
          ))}
        </div>

      </div>
    </Section>
  );
}

// Interactive GSAP-compatible Before/After Image Scrubber Viewport
function BeforeAfterSlider({ before, after }: { before: string, after: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
    setSliderPos(pos);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-ew-resize select-none touch-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background Optimized) */}
      <div className="absolute inset-0 w-full h-full">
        <img src={after} alt="After" className="w-full h-full object-cover scale-105" draggable={false} />
        <div className="absolute bottom-8 right-8 px-5 py-2 glass bg-black/60 rounded-full text-xs font-bold text-white uppercase tracking-widest z-0 shadow-lg">Optimized</div>
      </div>

      {/* Before Image (Foreground Masked Overlay via clip-path) */}
      <div 
        className="absolute inset-0 w-full h-full border-r-2 border-[#5483B3]/50 shadow-[5px_0_30px_rgba(0,0,0,0.8)] z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before} alt="Before" className="w-full h-full object-cover grayscale brightness-[0.3]" draggable={false} />
        <div className="absolute bottom-8 left-8 px-5 py-2 glass bg-black/60 rounded-full text-xs font-bold text-white/50 uppercase tracking-widest shadow-lg">Legacy</div>
      </div>

      {/* Drag Scrubber Handle Track */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-20 flex flex-col justify-center items-center pointer-events-none"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] text-black pointer-events-auto">
          <MoveHorizontal className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
