"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Cpu, Video, BarChart3, Presentation, Maximize2, Minimize2, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const panels = [
  { id: "content", title: "Content Engine", icon: Video, color: "#5483B3", defaultClass: "top-[10%] left-[5%] w-[380px] h-[280px]", details: "Processing viral hooks. Algorithmic retention: 84%. Flow state optimal." },
  { id: "automation", title: "Automation Node", icon: Cpu, color: "#7DA0CA", defaultClass: "top-[15%] right-[5%] w-[400px] h-[340px]", details: "Active API bridges: 14. Lead routing efficiency: <200ms latency." },
  { id: "analytics", title: "Analytics Core", icon: BarChart3, color: "#C1E8FF", defaultClass: "bottom-[10%] left-[8%] w-[420px] h-[300px]", details: "LTV to CAC ratio: 4.2. Current active sessions scaling logarithmically." },
  { id: "casestudies", title: "Case Studies Arc", icon: Presentation, color: "#00ff88", defaultClass: "bottom-[12%] right-[8%] w-[400px] h-[280px]", details: "Accessing deep-dive structural teardowns of previous client ecosystems." }
];

export function DashboardUI() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    // Simulate UI 'Boot Up' sequence
    tl.fromTo(".dash-panel", 
      { opacity: 0, scale: 0.8, y: 100, rotateX: 20 },
      { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 1.5, stagger: 0.15, ease: "back.out(1.4)" }
    );
    tl.fromTo(".dash-nav", 
      { opacity: 0, y: -40 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 
      "-=1"
    );
  }, { scope: containerRef });

  const togglePanel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isExpanding = expandedPanel !== id;
    setExpandedPanel(isExpanding ? id : null);

    // Cinematic WebGL background convergence mapping
    gsap.to("canvas", {
      scale: isExpanding ? 1.4 : 1,
      filter: isExpanding ? "blur(8px)" : "blur(0px)",
      duration: 1.5,
      ease: "power3.inOut"
    });
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none perspective-[2500px] z-20">
      
      {/* Central HUD Nav */}
      <div className="dash-nav absolute top-6 left-1/2 -translate-x-1/2 glass px-8 py-3 rounded-full border border-[#C1E8FF]/30 shadow-[0_20px_40px_rgba(0,240,255,0.15)] flex items-center gap-6 pointer-events-auto z-50">
        <div className="w-2 h-2 rounded-full bg-[#C1E8FF] animate-pulse shadow-[0_0_15px_#C1E8FF]" />
        <span className="text-[#C1E8FF] font-mono text-sm tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">System Online</span>
        <div className="h-4 w-px bg-white/20" />
        <button 
          onClick={(e) => {
            gsap.to("canvas", { scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.inOut" });
            setExpandedPanel(null);
          }}
          className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
        >
          Reset View
        </button>
      </div>

      {/* Floating System Panels */}
      {panels.map((panel) => {
        const Icon = panel.icon;
        const isExpanded = expandedPanel === panel.id;
        const isHidden = expandedPanel !== null && expandedPanel !== panel.id;

        return (
          <div
            key={panel.id}
            onClick={(e) => togglePanel(panel.id, e)}
            className={cn(
              "dash-panel absolute glass shadow-[0_30px_60px_rgba(0,0,0,0.7)] border overflow-hidden cursor-pointer pointer-events-auto transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isExpanded ? "top-[10%] left-[10%] w-[80%] h-[80%] z-40 rounded-[3rem]" : panel.defaultClass + " z-10 rounded-[2rem]",
              isHidden && "opacity-0 scale-90 pointer-events-none"
            )}
            style={{ 
              boxShadow: isExpanded ? `0 0 100px ${panel.color}20, inset 0 0 20px ${panel.color}10` : `0 20px 40px rgba(0,0,0,0.5)`,
              borderColor: isExpanded ? `${panel.color}50` : "rgba(255,255,255,0.1)"
            }}
          >
            {/* Panel Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-white/10 bg-black/40 backdrop-blur-md z-20">
              <div className="flex items-center gap-4">
                <Icon className="w-6 h-6" style={{ color: panel.color }} />
                <h3 className="text-lg font-black tracking-widest uppercase text-white drop-shadow-md">{panel.title}</h3>
              </div>
              <button className="text-white/50 hover:text-white transition-colors">
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Internal Console Simulation */}
            <div className="relative p-8 z-10 flex-grow flex flex-col h-full pointer-events-none">
              <p className="text-white/60 font-mono text-sm tracking-wider leading-relaxed mb-6 bg-black/50 p-4 rounded-xl border border-white/5">
                <span className="font-bold drop-shadow-[0_0_8px_currentColor]" style={{ color: panel.color }}>&gt;_ SYSTEM LOG:</span> {panel.details}
              </p>
              
              {/* Fake Data Visualization Graphics mapped to GSAP interactions */}
              <div className="flex-grow w-full border border-white/5 rounded-2xl bg-[#050505]/80 relative overflow-hidden flex flex-col items-center justify-center group pointer-events-auto shadow-[inset_0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
                
                {panel.id === "analytics" ? (
                  <svg className="absolute inset-0 w-full h-full p-8 md:p-12 stroke-current drop-shadow-[0_0_15px_currentColor] opacity-60 mix-blend-screen overflow-visible" style={{ color: panel.color }} viewBox="0 0 100 50" preserveAspectRatio="none">
                     <path d="M0,50 Q10,40 20,45 T40,30 T60,20 T80,10 T100,5" fill="none" strokeWidth="2" className="animate-[dash_3s_linear_infinite]" strokeDasharray="5 5" />
                  </svg>
                ) : panel.id === "content" ? (
                  <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                ) : panel.id === "automation" ? (
                  <div className="flex gap-4 md:gap-8 items-center absolute inset-0 justify-center">
                     <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#7DA0CA]/10 border border-[#7DA0CA]/50 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(138,43,226,0.3)]"><Cpu className="w-6 h-6 text-[#7DA0CA]" /></div>
                     <div className="w-16 md:w-24 h-[2px] bg-white/10 relative overflow-hidden"><div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,#C1E8FF,transparent)] -translate-x-full animate-[shimmer_1.5s_infinite]" /></div>
                     <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#C1E8FF]/10 border border-[#C1E8FF]/50 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.3)]" style={{ animationDelay: "0.5s" }}><Database className="w-6 h-6 text-[#C1E8FF]" /></div>
                  </div>
                ) : (
                  <div className="w-[80%] h-[2px] bg-white/10 absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-full">
                    <div className="h-full bg-current w-1/4 animate-[shimmer_2s_infinite]" style={{ color: panel.color }} />
                  </div>
                )}
                
                {isExpanded && (
                  <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center bg-black/60 glass px-6 py-3 rounded-xl border border-white/10 z-20">
                    <div className="text-white/30 font-mono text-xs md:text-sm uppercase tracking-widest leading-none">Initializing Secure Sub-routines...</div>
                    <div className="text-white/80 font-mono font-bold text-xs uppercase animate-pulse leading-none" style={{ color: panel.color }}>[SYS_OK]</div>
                  </div>
                )}
                
                <h4 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-10 font-black text-3xl md:text-5xl tracking-tighter mix-blend-overlay group-hover:scale-110 transition-transform duration-700 ease-out select-none opacity-20 pointer-events-none" style={{WebkitTextStroke: `1px ${panel.color}`}}>
                  DATA STREAM SECURE
                </h4>
              </div>
            </div>

            {/* Ambient Base Layer Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-0" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 z-0" style={{ backgroundColor: panel.color }} />
          </div>
        );
      })}

    </div>
  );
}
