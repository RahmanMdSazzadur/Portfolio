"use client";

import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";

export function AutomationSystemsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = [
    { id: 1, type: "Trigger", name: "Content Published", color: "border-[#5483B3]", bg: "bg-[#5483B3]/10", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { id: 2, type: "Data Extract", name: "Analytics API", color: "border-[#C1E8FF]", bg: "bg-[#C1E8FF]/10", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
    { id: 3, type: "Logic", name: "Filter & Format", color: "border-[#7DA0CA]", bg: "bg-[#7DA0CA]/10", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { id: 4, type: "Action", name: "Update Dashboard", color: "border-white/50", bg: "bg-white/5", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <Section id="automation" title="AUTOMATION SYSTEMS">
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <p className="text-xl md:text-3xl font-bold text-foreground/80 leading-relaxed">
          I don't just create content — <br/> 
          <span className="text-white">I build systems that run it automatically.</span>
        </p>
      </div>

      <div ref={containerRef} className="max-w-5xl mx-auto relative pt-10 pb-20 px-4">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <div className="relative glass rounded-[2rem] p-8 md:p-16 overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-2xl">
          
          {/* Animated SVG Path Connecting Nodes (Desktop) */}
          <svg className="absolute top-1/2 left-[12%] w-[76%] h-24 -translate-y-1/2 z-0 hidden md:block overflow-visible" preserveAspectRatio="none">
            <path 
              d="M 0 48 Q 12 48 24 48 T 100 48 T 200 48 T 300 48 T 400 48 T 500 48 T 1000 48" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Moving Pulses */}
            <circle r="4" fill="#C1E8FF" className="animate-[dash_3s_linear_infinite]" filter="drop-shadow(0 0 8px #C1E8FF)">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 0 48 L 1000 48" />
            </circle>
            <circle r="4" fill="#7DA0CA" className="animate-[dash_3s_linear_infinite]" filter="drop-shadow(0 0 8px #7DA0CA)">
              <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 0 48 L 1000 48" />
            </circle>
            <circle r="4" fill="#5483B3" className="animate-[dash_3s_linear_infinite]" filter="drop-shadow(0 0 8px #5483B3)">
              <animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M 0 48 L 1000 48" />
            </circle>
          </svg>

          {/* Vertical Path for Mobile */}
          <div className="absolute left-1/2 top-[10%] bottom-[10%] w-1 -translate-x-1/2 bg-white/10 z-0 md:hidden rounded-full overflow-hidden">
             <div className="w-full h-20 bg-gradient-to-b from-transparent via-primary to-transparent animate-[scrollDown_3s_linear_infinite]" />
             <div className="w-full h-20 bg-gradient-to-b from-transparent via-secondary to-transparent animate-[scrollDown_3s_linear_infinite]" style={{ animationDelay: "1s" }} />
             <div className="w-full h-20 bg-gradient-to-b from-transparent via-accent to-transparent animate-[scrollDown_3s_linear_infinite]" style={{ animationDelay: "2s" }} />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 relative z-10 w-full">
            {nodes.map((node, index) => (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center group w-full md:w-1/4"
              >
                {/* n8n Style Node Block */}
                <div className={`w-48 md:w-40 relative glass rounded-xl border-l-4 ${node.color} bg-[#111] p-4 shadow-xl flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)]`}>
                  <div className={`w-10 h-10 rounded-lg ${node.bg} flex items-center justify-center shrink-0`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={node.icon} />
                    </svg>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider truncate">{node.type}</span>
                    <span className="text-sm font-bold text-white truncate">{node.name}</span>
                  </div>
                  
                  {/* Connection Points */}
                  {index > 0 && <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30 hidden md:block" />}
                  {index < nodes.length - 1 && <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30 hidden md:block" />}
                </div>

                {/* Node Status Indicator */}
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ff9d] shadow-[0_0_8px_#00ff9d] animate-pulse" />
                  <span className="text-xs font-bold text-[#00ff9d] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Active</span>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </Section>
  );
}
