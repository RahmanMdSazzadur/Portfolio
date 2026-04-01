"use client";

import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function MetricsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const metrics = [
    { id: "rev", label: "Revenue Scale", value: 12, suffix: "M+", prefix: "$", color: "from-[#C1E8FF] to-blue-500" },
    { id: "camp", label: "Automations", value: 450, suffix: "+", color: "from-[#7DA0CA] to-purple-500" },
    { id: "eng", label: "Retention Rate", value: 340, suffix: "%", color: "from-[#5483B3] to-pink-500" },
    { id: "reach", label: "Global Reach", value: 50, suffix: "M+", color: "from-[#C1E8FF] to-[#7DA0CA]" },
  ];

  useGSAP(() => {
    // Hardware accelerated counter interpolation
    metrics.forEach((m) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: m.value,
        duration: 3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center+=100",
        },
        onUpdate: () => {
          const el = document.getElementById(`counter-${m.id}`);
          if (el) el.innerText = Math.floor(obj.val).toString();
        }
      });
    });

    // Simulate floating live-data notifications
    gsap.fromTo(".float-notif", 
      { y: 50, opacity: 0 }, 
      { 
        y: -100, 
        opacity: 0, 
        duration: 3.5, 
        stagger: { each: 2, repeat: -1 }, 
        ease: "power1.inOut",
        keyframes: {
          "0%": { opacity: 0 },
          "20%": { opacity: 1 },
          "80%": { opacity: 1 },
          "100%": { opacity: 0, y: -150 }
        }
      }
    );
  }, { scope: containerRef });

  return (
    <Section id="impact" className="py-32 bg-black/40 border-y border-white/5 relative overflow-hidden">
      <div ref={containerRef} className="container mx-auto px-6 relative z-10">
        
        {/* Floating Notifications mimicking a live platform */}
        <div className="absolute top-0 right-[25%] float-notif opacity-0 glass px-5 py-2.5 rounded-full border-[#C1E8FF]/30 text-[#C1E8FF] text-xs font-bold flex items-center gap-3 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="w-2 h-2 bg-[#C1E8FF] rounded-full animate-pulse shadow-[0_0_10px_#C1E8FF]" />
          CR LIFT: +12%
        </div>
        <div className="absolute top-20 left-[15%] float-notif opacity-0 glass px-5 py-2.5 rounded-full border-[#7DA0CA]/30 text-[#7DA0CA] text-xs font-bold flex items-center gap-3 backdrop-blur-xl shadow-[0_0_20px_rgba(138,43,226,0.2)]">
          <div className="w-2 h-2 bg-[#7DA0CA] rounded-full animate-pulse shadow-[0_0_10px_#7DA0CA]" />
          NEW LEAD ROUTED
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {metrics.map((metric, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center group cursor-default">
              <div className={`text-6xl md:text-8xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-4 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-700 ease-out`}>
                {metric.prefix}<span id={`counter-${metric.id}`}>0</span>{metric.suffix}
              </div>
              <div className="text-xs md:text-sm text-white/40 font-black uppercase tracking-widest">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
