"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/ui/Section";
import { Video, Cpu, BarChart3, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const nodes = [
  { id: "content", label: "Content", icon: Video, color: "#5483B3", x: 20, y: 50, details: "Viral hook architectures and attention-retention frameworks engineered to dominate algorithmic feeds." },
  { id: "automation", label: "Automation", icon: Cpu, color: "#7DA0CA", x: 50, y: 20, details: "Seamless Zapier integrations routing traffic into structured CRM tag-lists without human friction." },
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "#C1E8FF", x: 80, y: 50, details: "Real-time dashboarding computing LTV, CAC, and active drop-off zones for iterative AB testing." },
  { id: "distribution", label: "Distribution", icon: Share2, color: "#00ff88", x: 50, y: 80, details: "Multi-channel syndication mechanisms blasting core creative to secondary and tertiary platforms." }
];

export function GrowthEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<typeof nodes[0] | null>(null);

  useGSAP(() => {
    // Draw SVG lines on scroll
    gsap.fromTo(".engine-path", 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { 
        strokeDashoffset: 0, 
        duration: 2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "center center",
          scrub: 1
        }
      }
    );

    // Node entrance animations map
    gsap.fromTo(".engine-node",
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center+=100",
        }
      }
    );

    // Node pulse rings for live interaction illusion
    gsap.to(".engine-ring", {
      scale: 1.8,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out",
      stagger: 0.5
    });

  }, { scope: containerRef });

  return (
    <Section id="engine" title="System Architecture" subtitle="Select a node to inspect the automation infrastructure.">
      <div ref={containerRef} className="max-w-6xl mx-auto mt-12 relative aspect-square md:aspect-[16/9] glass rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden bg-black/60">
        
        {/* Core BG glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_60%)] blur-3xl pointer-events-none" />

        {/* Connection Map SVG */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="engine-path" d="M 20 50 Q 35 20 50 20" fill="none" stroke="rgba(255,0,85,0.5)" strokeWidth="0.4" />
          <path className="engine-path" d="M 50 20 Q 65 20 80 50" fill="none" stroke="rgba(138,43,226,0.5)" strokeWidth="0.4" />
          <path className="engine-path" d="M 80 50 Q 65 80 50 80" fill="none" stroke="rgba(0,240,255,0.5)" strokeWidth="0.4" />
          <path className="engine-path" d="M 50 80 Q 35 80 20 50" fill="none" stroke="rgba(0,255,136,0.5)" strokeWidth="0.4" />
          
          <path className="engine-path" d="M 50 20 L 50 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
          <path className="engine-path" d="M 20 50 L 80 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
        </svg>

        {/* Dynamic Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div 
              key={node.id} 
              className="engine-node absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setActiveNode(node)}
            >
              <div className="absolute inset-0 rounded-full engine-ring border border-white/20 z-0 pointer-events-none" style={{ borderColor: node.color }} />
              
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 z-10">
                <div className="absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 z-0" style={{ backgroundColor: node.color }} />
                <Icon className="w-8 h-8 md:w-10 md:h-10 relative z-10 transition-colors drop-shadow-md" style={{ color: node.color }} />
              </div>
              <span className="mt-4 font-bold text-xs md:text-sm tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">{node.label}</span>
            </div>
          );
        })}

        {/* Detail Overlay */}
        <AnimatePresence>
          {activeNode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute bottom-6 left-6 right-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[450px] glass bg-black/90 backdrop-blur-3xl p-8 md:p-12 rounded-[2rem] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.8)] z-50 text-center md:text-left"
            >
              <button 
                onClick={() => setActiveNode(null)} 
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mb-6 shadow-inner mx-auto md:mx-0">
                <activeNode.icon className="w-8 h-8 filter drop-shadow-lg" style={{ color: activeNode.color }} />
              </div>
              <h3 className="text-3xl font-black mb-3">{activeNode.label}</h3>
              <p className="text-foreground/70 font-medium leading-relaxed">{activeNode.details}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
